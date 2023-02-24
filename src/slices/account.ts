import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';
import Account, { ICredentials, IProfile, IAccount, IModuleSubscription } from '../models/Account';

export const authenticateUser = createAsyncThunk('account/authenticated', (credentials: ICredentials) => {
    return Account.authenticate(credentials);
});

export const registerUser = createAsyncThunk('account/registered', async (credentials: ICredentials) => {
    await Account.create(credentials);
    return Account.authenticate(credentials);
});

export const updateUserProfile = createAsyncThunk(
    'account/profile/updated',
    (payload: Omit<IProfile, 'id' | 'email'>) => {
        return Account.updateProfile(payload);
    },
);

export const subscribeToModule = createAsyncThunk<IModuleSubscription | undefined, string, { state: ISelectorState }>(
    'account/modules/subscribed',
    (moduleId, { getState }) => {
        const modules = selectSubscribedModules(getState());

        if (modules.includes(moduleId)) {
            return;
        }

        return Account.subscribeToModule(moduleId);
    },
);

export const markAccountAsDeleted = createAsyncThunk('account/deleted', async () => {
    return Account.markAsDeleted();
});

interface IAccountState {
    id?: string;
    profile?: IProfile;
    modules: IAccount['modules'];
    deleted?: boolean;
}

interface ISelectorState {
    account: IAccountState;
}

export const selectIsAuthenticated = (state: ISelectorState) => !!state.account.id;
export const setIsEnrolled = (state: ISelectorState) => !!state.account.profile;
export const selectProfile = (state: ISelectorState) => state.account.profile;
export const selectIsDeleted = (state: ISelectorState) => state.account.deleted;
export const selectSubscribedModules = (state: ISelectorState) => state.account.modules.map((subs) => subs.id);
export const selectUserId = (state: ISelectorState) => state.account.id;
export const selectDepartment = (state: ISelectorState) => state.account.profile?.department;
export const selectFullName = (state: ISelectorState) =>
    state.account.profile ? state.account.profile.firstName + ' ' + state.account.profile.lastName : null;

export default createSlice({
    name: 'account',
    initialState: { id: Account.persistedId, modules: [] } as IAccountState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(authenticateUser.fulfilled, (state, action) => {
                if (action.payload) {
                    state.id = action.payload.id;
                }
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                if (action.payload) {
                    state.id = action.payload.id;
                }
            })
            .addCase(markAccountAsDeleted.fulfilled, (state) => {
                state.deleted = true;
            })
            .addCase(boot.fulfilled, (state, action) => {
                if (action.payload.account) {
                    const { modules, profile, deleted } = action.payload.account;
                    state.profile = profile;
                    state.modules = modules;
                    state.deleted = deleted;
                }
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
            })
            .addCase(boot.rejected, (state) => {
                // Failed to boot for whatever reason, we set authenticated to false

                state.modules = [];
                delete state.id;
                delete state.profile;
                delete state.deleted;
            })
            .addCase(logOut.fulfilled, (state) => {
                state.modules = [];
                delete state.id;
                delete state.profile;
                delete state.deleted;
            })
            .addCase(subscribeToModule.fulfilled, (state, action) => {
                if (action.payload) {
                    state.modules.push(action.payload);
                }
            });
    },
}).reducer;
