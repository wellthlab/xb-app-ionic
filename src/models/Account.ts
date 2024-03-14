import { Credentials } from 'realm-web';

import { BaseModel, ObjectId } from './utils';
import { IExperiment } from './Experiment';
import { fcmService } from '../index';

export interface ICredentials {
    email: string;
    password: string;
}

export interface IProfile {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    campus?: string;
    office?: string;
}

export interface IAccount {
    id: string;
    profile: IProfile;
    subscriptions: ISubscription[];
    deleted?: boolean;
}

export interface ISubscription {
    experimentId: string;
    progress: boolean[][];
    subscribedAt: number;
}

export interface ISubscriptionDocument extends Omit<ISubscription, 'experimentId'> {
    experimentId: ObjectId;
}

export interface IAccountDocument extends Omit<IAccount, 'subscriptions'> {
    _id: ObjectId;
    subscriptions: ISubscriptionDocument[];
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
            subscriptions: subscriptions.map(({ experimentId, ...item }) => ({
                ...item,
                experimentId: experimentId.toString(),
            })),
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

        return this.fromDocument(result);
    }

    static async updateProfile(payload: Omit<IProfile, 'id' | 'email'>) {
        const db = this.getDb();

        const email = this.client.currentUser!.profile.email!;
        const id = this.client.currentUser!.id;
        const fcmDeviceToken = fcmService.getFCMDeviceToken();

        await db.collection<IAccountDocument>('accounts').updateOne(
            { _id: this.oid(id) },
            {
                $set: { profile: { ...payload, email } },
                $setOnInsert: { subscriptions: [] },
            },
            { upsert: true },
        );

        if (fcmDeviceToken) {
          await  Account.updateFCMDeviceToken(fcmDeviceToken);
        }

        return {
            email,
            ...payload,
        };
    }

    static async updateFCMDeviceToken(fcmDeviceToken: string) {
        const db = this.getDb();
        //
        // await db.collection<IAccountDocument>('accounts').updateOne(
        // );
    }

    static async subscribeToExperiment(experiment: IExperiment) {
        const db = this.getDb();

        const subscribedAt = Date.now();
        const progress = new Array(experiment.days.length)
            .fill([])
            .map((_, i) => new Array(experiment.days[i].tasks.length).fill(false)) as boolean[][];

        await db.collection<IAccountDocument>('accounts').updateOne(
            {
                _id: this.oid(this.client.currentUser!.id),
            },
            {
                $pull: {
                    subscriptions: { experimentId: this.oid(experiment.id) },
                },
            },
        );

        await db.collection<IAccountDocument>('accounts').updateOne(
            {
                _id: this.oid(this.client.currentUser!.id),
            },
            {
                $push: {
                    subscriptions: { experimentId: this.oid(experiment.id), progress, subscribedAt },
                },
            },
        );

        return { experimentId: experiment.id, progress, subscribedAt };
    }

    static async subscribeToParentExperiment() {}

    static async updateProgress(experimentId: string, dayId: number, taskId: number) {
        const db = this.getDb();

        await db.collection<IAccountDocument>('accounts').updateOne(
            {
                _id: this.oid(this.client.currentUser!.id),
            },
            {
                $set: {
                    [`subscriptions.$[elem].progress.${dayId}.${taskId}`]: true,
                },
            },
            {
                arrayFilters: [{ 'elem.experimentId': this.oid(experimentId) }],
            },
        );
    }

    static confirmAccount(token: string, tokenId: string) {
        return this.client.emailPasswordAuth.confirmUser({ token, tokenId });
    }

    static resendConfirmationEmail(email: string) {
        return this.client.emailPasswordAuth.resendConfirmationEmail({ email });
    }
}

export default Account;
