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
}

class Account {
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
        return 'stubbed_user';
    }

    static authenticate(credentials: ICredentials, retried?: boolean) {
        return {
            id: 'stubbed_user',
        };
    }

    static logOut() {}

    static create(credentials: ICredentials) {
        return {
            id: 'stubbed_user',
        };
    }

    static sendResetPasswordEmail(email: string, retried?: boolean) {}

    static markAsDeleted() {}

    static resetPassword(password: string, token: string, tokenId: string) {}

    static getDetails(): IAccount | null {
        const account = window.localStorage.getItem('account');
        if (!account) {
            return null;
        }
        return JSON.parse(account);
    }

    static updateProfile(payload: Omit<IProfile, 'email'>): IAccount | null {
        let account = this.getDetails();
        if (!account) {
            account = {
                id: 'stubbed_user',
                profile: {
                    email: 'stubbed_user',
                },
            };
        }
        account.profile = { ...account.profile, ...payload };
        window.localStorage.setItem('account', JSON.stringify(account));
        return account;
    }

    static confirmAccount(token: string, tokenId: string) {}

    static resendConfirmationEmail(email: string) {}
}

export default Account;
