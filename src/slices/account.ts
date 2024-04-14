import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';
import Account, { ICredentials, IProfile, IAccount, ISubscription } from '../models/Account';
import { IParentExperiment, IExperiment, IResponse } from '../models/Experiment';
import { selectAllExperiments, ISelectorState as IExperimentState } from './experiments';

export const authenticateUser = createAsyncThunk('account/authenticated', (credentials: ICredentials) => {
    return Account.authenticate(credentials);
});

export const registerUser = createAsyncThunk('account/registered', (credentials: ICredentials) => {
    return Account.create(credentials);
});

export const updateUserProfile = createAsyncThunk<
    Omit <IAccount, 'id' | 'subscriptions'>,
    { payload: Omit<IProfile, 'id' | 'email'>, cohortId: string }> (
    'account/profile/updated',
    ({ payload, cohortId }) => {
        return Account.updateProfile(payload, cohortId);
    },
);

export const subscribeToExperiment = createAsyncThunk<
    ISubscription | undefined,
    { experiment: IExperiment; resubscribe: boolean },
    { state: ISelectorState }
>('account/subscriptions/subscribed', ({ experiment, resubscribe }, { getState }) => {
    const subscriptions = selectSubscriptions(getState());

    if (!resubscribe && subscriptions[experiment.id]) {
        return;
    }

    return Account.subscribeToExperiment(experiment);
});

export const subscribeToParentExperiment = createAsyncThunk<
    ISubscription[] | undefined,
    { experiment: IParentExperiment; resubscribe: boolean },
    { state: ISelectorState & IExperimentState }
>('account/subscriptions/parent', ({ experiment, resubscribe }, { getState }) => {
    const subscriptions = selectSubscriptions(getState());

    if (!resubscribe && experiment.children.every((item) => subscriptions[item])) {
        return;
    }

    const experiments = selectAllExperiments(getState());

    return Promise.all(
        experiment.children.map((item) => Account.subscribeToExperiment(experiments[item] as IExperiment)), // Experiment children are guaranteed to not be child experiments
    );
});

export const markAccountAsDeleted = createAsyncThunk('account/deleted', async () => {
    return Account.markAsDeleted();
});

export const updateProgress = createAsyncThunk(
    'account/subscriptions/updateProgress',
    async ({ experimentId, dayNum, taskNum }: { experimentId: string; dayNum: number; taskNum: number }) => {
    },
);

interface IAccountState {
    id?: string;
    profile?: IProfile;
    cohortId?: string;
    subscriptions: Record<string, Omit<ISubscription, 'experimentId'>>;
    responses: Record<string, IResponse[]>,
    deleted?: boolean;
}

export interface ISelectorState {
    account: IAccountState;
}

export const selectIsAuthenticated = (state: ISelectorState) => !!state.account.id;

export const selectIsEnrolled = (state: ISelectorState) => !!state.account.profile;

export const selectProfile = (state: ISelectorState) => state.account.profile;

export const selectIsDeleted = (state: ISelectorState) => state.account.deleted;

export const selectSubscriptions = (state: ISelectorState) => state.account.subscriptions;

export const selectSubscriptionByExperimentId = (state: ISelectorState,  experimentId: string) => state.account.subscriptions[experimentId];

export const selectUserId = (state: ISelectorState) => state.account.id;

export const selectDepartment = (state: ISelectorState) => state.account.profile?.department;

export const selectFullName = (state: ISelectorState) =>
    state.account.profile ? state.account.profile.firstName + ' ' + state.account.profile.lastName : null;

export const selectResponses = (state: ISelectorState) => state.account.responses;

export default createSlice({
    name: 'account',
    initialState: { id: Account.persistedId, subscriptions: {}, responses: {} } as IAccountState,
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
                state.responses = action.payload.responses;
                for (const sub of action.payload.subscriptions) {
                    state.subscriptions[sub.experimentId] = { id: sub.id, subscribedAt: sub.subscribedAt, accountId: sub.accountId };
                }
                if (action.payload.account) {
                    state.profile = action.payload.account.profile;
                }
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.profile = action.payload.profile;
                state.cohortId = action.payload.cohortId;
            })
            .addCase(boot.rejected, (state) => {
                // Failed to boot for whatever reason, we set authenticated to false

                state.subscriptions = {};
                state.responses = {};
                delete state.cohortId;
                delete state.id;
                delete state.profile;
                delete state.deleted;
            })
            .addCase(logOut.fulfilled, (state) => {

                state.subscriptions = {};
                state.responses = {};
                delete state.cohortId;
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
            .addCase(subscribeToParentExperiment.fulfilled, (state, action) => {
                if (action.payload) {
                    for (const subscription of action.payload) {
                        const { experimentId, ...others } = subscription;
                        state.subscriptions[experimentId] = others;
                    }
                }
            });
    },
}).reducer;
