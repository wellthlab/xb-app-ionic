import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Realm from 'realm-web';

import { getDb, realmApp, oid } from '@/realm';

export enum LoginErrorCodes {
    InvalidCredentials = 'InvalidPassword',
    Unverified = 'AuthError',
}

export enum RegisterErrorCodes {
    EmailInUse = 'AccountNameInUse',
}

export enum PasswordResetErrorCodes {
    EmailNotFound = 'UserNotFound',
}

export type Credentials = {
    email: string;
    password: string;
};

export const queryKeys = {
    user: ['user'],
};

export function useUser() {
    return useQuery({
        queryKey: queryKeys.user,

        queryFn: async () => {
            if (!realmApp.currentUser) {
                return null;
            }

            const account = await getDb()!
                .collection('accounts')
                .findOne({
                    _id: oid(realmApp.currentUser!.id),
                });

            return account || { id: realmApp.currentUser!.id };
        },
    });
}

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ email, password }: Credentials) =>
            realmApp.logIn(Realm.Credentials.emailPassword(email, password)),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.user });
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => realmApp.currentUser?.logOut(),
        onSuccess: () => {
            queryClient.setQueryData(queryKeys.user, null);
        },
    });
}

export function useRegisterUser() {
    return useMutation({
        mutationFn: async (payload: Credentials) => realmApp.emailPasswordAuth.registerUser(payload),
    });
}

export function useResendConfirmationEmail() {
    return useMutation({
        mutationFn: async (payload: { email: string }) => realmApp.emailPasswordAuth.resendConfirmationEmail(payload),
    });
}

export function useSendRecoveryEmail() {
    return useMutation({
        mutationFn: async (payload: { email: string }) => realmApp.emailPasswordAuth.sendResetPasswordEmail(payload),
    });
}

export function useVerifyAccount() {
    return useMutation({
        mutationFn: async (payload: { token: string; tokenId: string }) =>
            realmApp.emailPasswordAuth.confirmUser(payload),
    });
}

export function useResetPassword() {
    return useMutation({
        mutationFn: async (payload: { token: string; tokenId: string; password: string }) =>
            realmApp.emailPasswordAuth.resetPassword(payload),
    });
}
