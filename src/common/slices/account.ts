import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';
import Account, { ICredentials, IProfile } from '../models/Account';

export const authenticateUser = createAsyncThunk('account/authenticated', (credentials: ICredentials) => {
    return Account.authenticate(credentials);
});

export const registerUser = createAsyncThunk('account/registered', async (credentials: ICredentials) => {
    await Account.create(credentials);
    return Account.authenticate(credentials);
});

export const updateUserProfile = createAsyncThunk('account/updated', (payload: Omit<IProfile, 'id' | 'email'>) => {
    return Account.updateProfile(payload);
});

interface IAccountState {
    authenticated: boolean;
    profile?: IProfile;
}

interface ISelectorState {
    account: IAccountState;
}

export const selectIsAuthenticated = (state: ISelectorState) => state.account.authenticated;
export const setIsEnrolled = (state: ISelectorState) => !!state.account.profile;
export const selectProfile = (state: ISelectorState) => state.account.profile;
export const selectUserId = (state: ISelectorState) => state.account.profile?.id;
export const selectDepartment = (state: ISelectorState) => state.account.profile?.department;
export const selectFullName = (state: ISelectorState) =>
    state.account.profile ? state.account.profile.firstName + ' ' + state.account.profile.lastName : null;

export default createSlice({
    name: 'account',
    initialState: { authenticated: Account.isAuthenticated } as IAccountState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(authenticateUser.fulfilled, (state) => {
                state.authenticated = true;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.authenticated = true;
            })
            .addCase(boot.fulfilled, (state, action) => {
                if (action.payload.profile) {
                    state.profile = action.payload.profile;
                }
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
            })
            .addCase(boot.rejected, (state) => {
                // Failed to boot for whatever reason, we set authenticated to false

                state.authenticated = false;
                delete state.profile;
            })
            .addCase(logOut.fulfilled, (state) => {
                state.authenticated = false;
                delete state.profile;
            });
    },
}).reducer;
