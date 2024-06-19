import { BSON, Credentials } from 'realm-web';

import { BaseModel, ObjectId } from './utils';
import { IExperimentSchedule } from './Experiment';
import { convertObjectIdFieldsToString } from '../utils/helperFunctions';

export interface ICohort {
    startDate: number,
    name: string,
    id: string;
    experimentSchedule: IExperimentSchedule[]
}

interface ICohortDocument extends ICohort {
    _id: ObjectId;
}

export interface ICredentials {
    email: string;
    password: string;
}

export interface IProfile {
    email: string;
    [K: string]: string | boolean | number;
}

export interface IAccount {
    id: string;
    profile: IProfile;
    cohortId: string;
    subscriptions: string[];
    notes?: Record<number, string>;
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

        const records = await db.collection<ISubscriptionDocument>('subscriptions').find({ _id: { $in: subscriptionIdsAsObjectIds } });
        records.forEach(record => convertObjectIdFieldsToString(record));

        return records.map(record => {
            const asISubscription = record as unknown as ISubscription;
            asISubscription.id = record._id as unknown as string;
            return asISubscription;
        });
    }

    static async updateProfile(payload: Omit<IProfile, 'email'>,  cohortId?: string | null) {
        let cohort;
        if (!cohortId) {
            cohort = await this.createDefaultCohort();
        } else {
            cohort = await this.getCohortDetails(cohortId);
        }

        const db = this.getDb();
        const email = this.client.currentUser!.profile.email!;
        const id = this.client.currentUser!.id;

        await db.collection<IAccountDocument>('accounts').updateOne(
            { _id: this.oid(id) },
            {
                $set: { profile: { ...payload, email }, cohortId: this.oid(cohort!.id) },
                $setOnInsert: { subscriptions: [] },
            },
            { upsert: true },
        );

        return {
            profile: { email, ...payload } as IProfile,
            cohort: cohort!,
        };
    }

    static async createDefaultCohort() {
        const db = this.getDb();
        const newCohort = { startDate: Date.now(), name: 'DEFAULT_INDIVIDUAL_COHORT'.concat('_', this.client.currentUser!.id.toString()), experimentSchedule: [] };

        const insertResult = (await db.collection('cohorts').insertOne(
            newCohort,
        ));

        return {...newCohort, id: insertResult.insertedId.toString()} as ICohort;
    }

    static async getCohortDetails(cohortId: string): Promise<ICohort | null> {
        const db = this.getDb();
        const result = await db.collection<ICohortDocument>('cohorts').findOne({
            _id: this.oid(cohortId),
        });

        if (!result) {
            return null;
        }

        convertObjectIdFieldsToString(result);
        const asICohort= result as unknown as ICohort;
        asICohort.id = result._id as unknown as string;
        return asICohort;
    }

    static async subscribeToExperiments(newSubscriptions: Omit<ISubscription, 'id'>[]) {
        const db = this.getDb();
        const accountId = this.oid(this.client.currentUser!.id);
        const records = newSubscriptions.map(newSubscription => {
            return {
                _id: new BSON.ObjectId(),
                experimentId: this.oid(newSubscription.experimentId),
                subscribedAt: newSubscription.subscribedAt,
            };
        });

        await db.collection('subscriptions').insertMany(records);
        await db.collection<IAccountDocument>('accounts').updateOne(
            {
                _id: accountId,
            },
            {
                $push: {
                    subscriptions: { $each: records.map(record => record._id) },
                },
            },
        );

        return records.map((record) => {
            return {
                experimentId: record.experimentId.toString(),
                subscribedAt: record.subscribedAt,
                id: record._id.toString(),
                accountId: this.client.currentUser!.id,
            };
        });
    }

    static async saveNotes(notes: Record<number, string>) {
        const db = this.getDb();
        const accountId = this.oid(this.client.currentUser!.id);

        await db.collection<IAccountDocument>('accounts').updateOne(
            {
                _id: accountId,
            },
            {
                $set: {
                    notes: notes,
                },
            },
        );
        return notes;
    }

    static deleteSubscriptions(subscriptionIds: string []) {
        const db = this.getDb();
        const subscriptionIdsAsObjectId = subscriptionIds.map(s => this.oid(s));

        return db
            .collection('subscriptions')
            .deleteMany({ _id: { $in: subscriptionIdsAsObjectId } });
    }

    static async removeAccountSubscriptions(subscriptionIds: string[]) {
        const db = this.getDb();
        const accountId = this.oid(this.client.currentUser!.id);
        const subscriptionIdsAsObjectId = subscriptionIds.map(s => this.oid(s));

        await db.collection<IAccountDocument>('accounts').updateOne(
            {
                _id: accountId,
            },
            {
                $pull: {
                    subscriptions: { $in: subscriptionIdsAsObjectId },
                },
            },
        );
    }

    static async deletePendingNotifications() {
        const db = this.getDb();
        const userId = this.oid(this.client.currentUser!.id);

        await db.collection('pendingNotifications').deleteMany({
            userId: userId,
        });
    }

    static confirmAccount(token: string, tokenId: string) {
        return this.client.emailPasswordAuth.confirmUser({ token, tokenId });
    }

    static resendConfirmationEmail(email: string) {
        return this.client.emailPasswordAuth.resendConfirmationEmail({ email });
    }
}

export default Account;
