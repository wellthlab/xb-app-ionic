import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';
import Account, { ICredentials, IProfile, IAccount, ISubscription } from '../models/Account';
import { IExperiment } from '../models/Experiment';

export const authenticateUser = createAsyncThunk('account/authenticated', (credentials: ICredentials) => {
    return Account.authenticate(credentials);
});

export const registerUser = createAsyncThunk('account/registered', (credentials: ICredentials) => {
    return Account.create(credentials);
});

export const updateUserProfile = createAsyncThunk(
    'account/profile/updated',
    (payload: Omit<IProfile, 'id' | 'email'>) => {
        return Account.updateProfile(payload);
    },
);

export const subscribeToExperiment = createAsyncThunk<
    ISubscription | undefined,
    IExperiment,
    { state: ISelectorState }
>('account/subscriptions/subscribed', (experiment, { getState }) => {
    const experimentIds = selectSubscriptions(getState());

    if (experimentIds[experiment.id]) {
        return;
    }

    return Account.subscribeToExperiment(experiment);
});

export const markAccountAsDeleted = createAsyncThunk('account/deleted', async () => {
    return Account.markAsDeleted();
});

export const updateProgress = createAsyncThunk(
    'account/subscriptions/updateProgress',
    async ({ experimentId, dayId, taskId }: { experimentId: string; dayId: number; taskId: number }) => {
        await Account.updateProgress(experimentId, dayId, taskId);
        return { experimentId, dayId, taskId };
    },
);

interface IAccountState {
    id?: string;
    profile?: IProfile;
    subscriptions: Record<string, Omit<IAccount['subscriptions'][number], 'experimentId'>>;
    deleted?: boolean;
}

export interface ISelectorState {
    account: IAccountState;
}

export const selectIsAuthenticated = (state: ISelectorState) => !!state.account.id;
export const setIsEnrolled = (state: ISelectorState) => !!state.account.profile;
export const selectProfile = (state: ISelectorState) => state.account.profile;
export const selectIsDeleted = (state: ISelectorState) => state.account.deleted;
export const selectSubscriptions = (state: ISelectorState) => state.account.subscriptions;
export const selectProgress = (state: ISelectorState, experimentId: string) =>
    state.account.subscriptions[experimentId].progress;
export const selectUserId = (state: ISelectorState) => state.account.id;
export const selectDepartment = (state: ISelectorState) => state.account.profile?.department;
export const selectFullName = (state: ISelectorState) =>
    state.account.profile ? state.account.profile.firstName + ' ' + state.account.profile.lastName : null;

export default createSlice({
    name: 'account',
    initialState: { id: Account.persistedId, subscriptions: {} } as IAccountState,
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
            .addCase(boot.fulfilled, (_, action) => {
                if (action.payload.account) {
                    const { subscriptions: rawSubs, ...others } = action.payload.account;

                    const subscriptions: IAccountState['subscriptions'] = {};

                    for (const sub of rawSubs) {
                        subscriptions[sub.experimentId] = { progress: sub.progress, subscribedAt: sub.subscribedAt };
                    }

                    return {
                        ...others,
                        subscriptions,
                    };
                }
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
            })
            .addCase(boot.rejected, (state) => {
                // Failed to boot for whatever reason, we set authenticated to false

                state.subscriptions = {};
                delete state.id;
                delete state.profile;
                delete state.deleted;
            })
            .addCase(logOut.fulfilled, (state) => {
                state.subscriptions = {};
                delete state.id;
                delete state.profile;
                delete state.deleted;
            })
            .addCase(subscribeToExperiment.fulfilled, (state, action) => {
                if (action.payload) {
                    const { experimentId, ...others } = action.payload;
                    state.subscriptions[experimentId] = others;
                }
            })
            .addCase(updateProgress.fulfilled, (state, action) => {
                const progress = state.subscriptions[action.payload.experimentId].progress;

                progress[action.payload.dayId][action.payload.taskId] = true;
            });
    },
}).reducer;
