import { Credentials } from 'realm-web';

import { BaseModel, ObjectId } from './utils';

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
    modules: IModuleSubscription[];
    deleted?: boolean;
}

export interface IModuleSubscription {
    id: string;
    subscribedAt: number;
}

export interface IAccountDocument extends Omit<IAccount, 'id' | 'modules'> {
    _id: ObjectId;
    modules: { id: ObjectId; subscribedAt: number }[];
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

    static authenticate(credentials: ICredentials) {
        if (this.client.currentUser) {
            return;
        }

        return this.client.logIn(Credentials.emailPassword(credentials.email, credentials.password));
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

    static async sendResetPasswordEmail(email: string) {
        try {
            return await this.client.emailPasswordAuth.sendResetPasswordEmail({ email });
        } catch (error) {
            console.log(error);
            if (error instanceof Error && error.message.includes('user not found')) {
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

    static transformDocument(document: IAccountDocument): IAccount {
        const { _id, modules, ...others } = document;

        return {
            ...others,
            id: _id.toString(),
            modules: modules.map(({ id, subscribedAt }) => ({ id: id.toString(), subscribedAt })),
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

        return this.transformDocument(result);
    }

    static async updateProfile(payload: Omit<IProfile, 'id' | 'email'>): Promise<IProfile> {
        const db = this.getDb();

        const email = this.client.currentUser!.profile.email!;
        const id = this.client.currentUser!.id;

        await db.collection<IAccountDocument>('accounts').updateOne(
            { _id: this.oid(id) },
            {
                $set: { profile: { ...payload, email } },
                $setOnInsert: { modules: [] },
            },
            { upsert: true },
        );

        return {
            email,
            ...payload,
        };
    }

    static async subscribeToModule(moduleId: string) {
        const db = this.getDb();

        const subscribedAt = Date.now();

        await db.collection<IAccountDocument>('accounts').updateOne(
            {
                _id: this.oid(this.client.currentUser!.id),
            },
            { $push: { modules: { id: this.oid(moduleId), subscribedAt } } },
        );

        return { id: moduleId, subscribedAt };
    }
}

export default Account;
