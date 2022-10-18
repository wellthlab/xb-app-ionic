import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import Account, { ICredentials, IProfile } from '../models/Account';
import Team from '../models/Team';

export const authenticateUser = createAsyncThunk('account/authenticated', (credentials: ICredentials) => {
    return Account.authenticate(credentials);
});

export const logOutUser = createAsyncThunk('account/loggedOut', () => {
    return Account.logOut();
});

export const registerUser = createAsyncThunk('account/registered', async (credentials: ICredentials) => {
    await Account.create(credentials);
    return Account.authenticate(credentials);
});

export const hydrateAccount = createAsyncThunk('account/hydrated', async () => {
    const result = await Promise.all([Account.getProfile(), Team.getCurrentTeam()]);
    return {
        profile: result[0],
        team: result[1],
    };
});

export const completeProfile = createAsyncThunk('account/completed', (response: Omit<IProfile, 'id' | 'email'>) => {
    return Account.completeProfile(response);
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
            .addCase(hydrateAccount.fulfilled, (state, action) => {
                if (action.payload.profile) {
                    state.profile = action.payload.profile;
                }
            })
            .addCase(completeProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
            })
            .addCase(hydrateAccount.rejected, (state) => {
                // Failed to hydrate for whatever reason, we set authenticated to false

                state.authenticated = false;
                delete state.profile;
            })
            .addCase(logOutUser.fulfilled, (state) => {
                state.authenticated = false;
                delete state.profile;
            });
    },
}).reducer;
