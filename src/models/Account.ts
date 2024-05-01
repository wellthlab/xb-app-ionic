import { Credentials } from 'realm-web';

import { BaseModel, ObjectId } from './utils';
import { IExperiment } from './Experiment';
import { convertObjectIdFieldsToString } from '../utils/helperFunctions';

export interface ICohort {
    startDate: number,
    id: string;
}
export interface ICredentials {
    email: string;
    password: string;
}

export interface IProfile {
    firstName: string;
    lastName: string;
    email: string;
    department?: string;
    campus?: string;
    office?: string;
}

export interface IAccount {
    id: string;
    profile: IProfile;
    cohortId: string,
    subscriptions: string[],
    notes?: Record<number, string>
    deleted?: boolean;
}

export interface ISubscription {
    experimentId: string;
    subscribedAt: number;
    id: string;
}

export interface ISubscriptionDocument extends Omit<ISubscription, 'experimentId'> {
    experimentId: ObjectId;
    _id: ObjectId;
}

export interface IAccountDocument extends Omit<IAccount, 'subscriptions'> {
    _id: ObjectId;
    subscriptions: ObjectId[];
}

class Account extends BaseModel {
    static DEPARTMENTS = [
        'Winchester School of Art',
        'Archaeology',
        'English',
        'Film',
        'History',
        'Modern Languages and Linguistics',
        'Music',
        'Philosophy',
        'Chemistry',
        'Electronics and Computer Science',
        'Engineering',
        'FEPS Enterprise/nC2',
        'Physics and Astronomy',
        'Southampton Marine and Maritime Institute',
        'Web Science Institute',
        'Zepler Institute for Photonics and Nanoelectronics',
        'Southampton Law School',
        'Economic, Social and Political Sciences',
        'Southampton Business School',
        'Mathematical Sciences',
        'Southampton Education School',
        'Medicine',
        'Cancer Science',
        'Human Development and Health',
        'Clinical and Experimental Science',
        'Primary Care, Population Sci and Medical Education',
        'Biological Sciences',
        'Health Sciences',
        'Geography and Environmental Sciences',
        'Ocean and Earth Science',
        'Psychology',
        'Professional Services',
        'Other',
    ] as const;

    static CAMPUS = ['1 Guildhall Square', 'Avenue', 'Boldrewood', 'Highfield', 'Waterfront', 'Winchester'] as const;

    static get persistedId() {
        return this.client.currentUser?.id;
    }

    static async authenticate(
        credentials: ICredentials,
        retried?: boolean,
    ): Promise<Awaited<ReturnType<typeof this.client.logIn>> | undefined> {
        if (this.client.currentUser) {
            return;
        }

        try {
            return await this.client.logIn(Credentials.emailPassword(credentials.email, credentials.password));
        } catch (error) {
            if (error instanceof Error && error.message.includes('invalid') && !retried) {
                console.log('Failed authentication, retrying with lowercase email');
                return this.authenticate(
                    { email: credentials.email.toLowerCase(), password: credentials.password },
                    true,
                );
            }

            throw error;
        }
    }

    static logOut() {
        if (!this.client.currentUser) {
            return;
        }

        return this.client.currentUser.logOut();
    }

    static async create(credentials: ICredentials) {
        if (this.client.currentUser) {
            return;
        }

        return this.client.emailPasswordAuth.registerUser(credentials.email, credentials.password);
    }

    static async sendResetPasswordEmail(email: string, retried?: boolean) {
        try {
            return await this.client.emailPasswordAuth.sendResetPasswordEmail({ email });
        } catch (error) {
            console.log(error);
            if (error instanceof Error && error.message.includes('user not found')) {
                if (!retried) {
                    console.log('Failed reset, retrying with lowercase email');
                    this.sendResetPasswordEmail(email.toLowerCase(), true);
                    return;
                }

                return;
            }

            throw error;
        }
    }

    static async markAsDeleted() {
        const db = this.getDb();
        return db
            .collection<IAccountDocument>('accounts')
            .updateOne({ _id: this.oid(this.client.currentUser!.id) }, { $set: { deleted: true } });
    }

    static resetPassword(password: string, token: string, tokenId: string) {
        return this.client.emailPasswordAuth.resetPassword({ password, token, tokenId });
    }

    static fromDocument(document: IAccountDocument): IAccount {
        const { _id, subscriptions, ...others } = document;

        return {
            ...others,
            id: _id.toString(),
            subscriptions: subscriptions.map(subscriptionId => subscriptionId.toString()),
        };
    }

    static async getDetails(): Promise<IAccount | null> {
        const db = this.getDb();
        const result = await db.collection<IAccountDocument>('accounts').findOne({
            _id: this.oid(this.client.currentUser!.id),
        });

        if (!result) {
            return null;
        }

        convertObjectIdFieldsToString(result);
        const asIAccount= result as unknown as IAccount;
        asIAccount.id = result._id as unknown as string;
        return asIAccount;
    }

    static async getSubscriptions(subscriptionIds: string[]): Promise<ISubscription[]> {
        const db = this.getDb();
        const subscriptionIdsAsObjectIds = subscriptionIds.map(subscriptionId => this.oid(subscriptionId));

        const records = await db.collection<ISubscriptionDocument>('subscriptions').find({_id: { $in: subscriptionIdsAsObjectIds }} );
        records.forEach(record => convertObjectIdFieldsToString(record));

        return records.map(record => {
            const asISubscription= record as unknown as ISubscription;
            asISubscription.id = record._id as unknown as string;
            return asISubscription;
        });
    }

    static async updateProfile(payload: Omit<IProfile, 'id' | 'email'>, cohortId: string | undefined) {
        if (!cohortId) {
            cohortId = await this.createNewCohort();
        }

        const db = this.getDb();
        const email = this.client.currentUser!.profile.email!;
        const id = this.client.currentUser!.id;

         await db.collection<IAccountDocument>('accounts').updateOne(
            { _id: this.oid(id) },
            {
                $set: { profile: { ...payload, email }, cohortId: cohortId },
                $setOnInsert: { subscriptions: [] },
            },
            { upsert: true },
        );

        return {
            profile :{email,...payload},
            cohortId
        };
    }

    static async createNewCohort() {
        const db = this.getDb();
        const startDate = Date.now();

        const insertResult = (await db.collection('cohorts').insertOne(
            {startDate: startDate }
        ));

        return insertResult.insertedId.toString() as string;
    }

    static async subscribeToExperiment(experiment: IExperiment) {
        const db = this.getDb();

        const accountId = this.oid(this.client.currentUser!.id);
        const subscribedAt = Date.now();

        const insertedId = (await db.collection('subscriptions').insertOne(
            {experimentId: this.oid(experiment.id), subscribedAt }
        )).insertedId;


        await db.collection<IAccountDocument>('accounts').updateOne(
            {
                _id: accountId,
            },
            {
                $push: {
                    subscriptions: insertedId,
                },
            },
        );

        return {
            experimentId: experiment.id,
            subscribedAt,
            id: insertedId.toString() as string,
            accountId: this.client.currentUser!.id
        };
    }

    static async saveNotes(notes : Record<number, string>) {
        const db = this.getDb();
        const accountId = this.oid(this.client.currentUser!.id);

        await db.collection<IAccountDocument>('accounts').updateOne(
            {
                _id: accountId,
            },
            {
                $set: {
                    notes: notes
                }
            }
        );
        return notes;
    }

    static confirmAccount(token: string, tokenId: string) {
        return this.client.emailPasswordAuth.confirmUser({ token, tokenId });
    }

    static resendConfirmationEmail(email: string) {
        return this.client.emailPasswordAuth.resendConfirmationEmail({ email });
    }
}

export default Account;
