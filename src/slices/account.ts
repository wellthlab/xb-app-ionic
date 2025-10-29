import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';
import Account, { ICredentials, IProfile } from '../models/Account';

export const authenticateUser = createAsyncThunk('account/authenticated', (credentials: ICredentials) => {
    return Account.authenticate(credentials);
});

export const registerUser = createAsyncThunk('account/registered', (credentials: ICredentials) => {
    return Account.create(credentials);
});

export const updateUserProfile = createAsyncThunk(
    'account/profile/updated',
    ({ payload }: { payload: Omit<IProfile, 'email'> }) => {
        return Account.updateProfile(payload);
    },
);

export const markAccountAsDeleted = createAsyncThunk('account/deleted', async () => {
    return Account.markAsDeleted();
});

export const markAccountAsOnboarded = createAsyncThunk('account/onboarded', async () => {
    window.localStorage.setItem('onboarded', 'true');
});

interface IAccountState {
    id?: string;
    profile?: IProfile;
    deleted?: boolean;
    onboarded: boolean;
}

export interface ISelectorState {
    account: IAccountState;
}

export const selectIsAuthenticated = (state: ISelectorState) => !!state.account.id;

export const selectIsEnrolled = (state: ISelectorState) => !!state.account.profile;

export const selectIsOnboarded = (state: ISelectorState) => state.account.onboarded;

export const selectProfile = (state: ISelectorState) => state.account.profile;
export const selectIsDeleted = (state: ISelectorState) => state.account.deleted;

export const selectUserId = (state: ISelectorState) => state.account.id;

export const selectFullName = (state: ISelectorState) =>
    state.account.profile ? state.account.profile.firstName + ' ' + state.account.profile.lastName : null;

export default createSlice({
    name: 'account',
    initialState: {
        id: Account.persistedId,
        onboarded: window.localStorage.getItem('onboarded') === 'true',
    } as IAccountState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(authenticateUser.fulfilled, (state, action) => {
                if (action.payload) {
                    state.id = action.payload.id;
                }
            })
            .addCase(markAccountAsDeleted.fulfilled, (state) => {
                state.deleted = true;
            })
            .addCase(boot.fulfilled, (state, action) => {
                if (action.payload.account) {
                    state.profile = action.payload.account.profile;
                }
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                if (action.payload) {
                    state.profile = action.payload.profile;
                }
            })
            .addCase(markAccountAsOnboarded.fulfilled, (state) => {
                state.onboarded = true;
            })
            .addCase(boot.rejected, (state) => {
                // Failed to boot for whatever reason, we set authenticated to false

                delete state.id;
                delete state.profile;
                delete state.deleted;
            })
            .addCase(logOut.fulfilled, (state) => {
                delete state.id;
                delete state.profile;
                delete state.deleted;
            });
    },
}).reducer;
