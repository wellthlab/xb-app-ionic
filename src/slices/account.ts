import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';
import Account, { ICredentials, IAccount, ISubscription } from '../models/Account';
import { IParentExperiment, IExperiment } from '../models/Experiment';
import { selectAllExperimentsById, ISelectorState as IExperimentState } from './experiments';

export const authenticateUser = createAsyncThunk('account/authenticated', (credentials: ICredentials) => {
    return Account.authenticate(credentials);
});

export const registerUser = createAsyncThunk('account/registered', (credentials: ICredentials) => {
    return Account.create(credentials);
});

export const enroll = createAsyncThunk('account/profile/updated', () => {
    return Account.enroll();
});

export const subscribeToExperiment = createAsyncThunk<
    ISubscription | undefined,
    { experiment: IExperiment; resubscribe: boolean },
    { state: ISelectorState }
>('account/subscriptions/subscribed', ({ experiment, resubscribe }, { getState }) => {
    const experimentIds = selectSubscriptions(getState());

    if (!resubscribe && experimentIds[experiment.id]) {
        return;
    }

    return Account.subscribeToExperiment(experiment);
});

export const subscribeToParentExperiment = createAsyncThunk<
    ISubscription[] | undefined,
    { experiment: IParentExperiment; resubscribe: boolean },
    { state: ISelectorState & IExperimentState }
>('account/subscriptions/parent', ({ experiment, resubscribe }, { getState }) => {
    const experimentIds = selectSubscriptions(getState());

    if (!resubscribe && experiment.children.every((item) => experimentIds[item])) {
        return;
    }

    const experiments = selectAllExperimentsById(getState());

    return Promise.all(
        experiment.children.map((item) => Account.subscribeToExperiment(experiments[item] as IExperiment)), // Experiment children are guaranteed to not be child experiments
    );
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
    enrolled: boolean;
    subscriptions: Record<string, Omit<IAccount['subscriptions'][number], 'experimentId'>>;
    deleted?: boolean;
}

export interface ISelectorState {
    account: IAccountState;
}

export const selectIsAuthenticated = (state: ISelectorState) => !!state.account.id;

export const selectIsEnrolled = (state: ISelectorState) => state.account.enrolled;

export const selectIsDeleted = (state: ISelectorState) => state.account.deleted;

export const selectSubscriptions = (state: ISelectorState) => state.account.subscriptions;

export const selectProgress = (state: ISelectorState, experimentId: string) =>
    state.account.subscriptions[experimentId].progress;

export const selectUserId = (state: ISelectorState) => state.account.id;

export default createSlice({
    name: 'account',
    initialState: { id: Account.persistedId, enrolled: false, subscriptions: {} } as IAccountState,
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
                        enrolled: true,
                        subscriptions,
                    };
                }
            })
            .addCase(enroll.fulfilled, (state, action) => {
                state.enrolled = true;

                const subscriptions: IAccountState['subscriptions'] = {};

                for (const sub of action.payload) {
                    subscriptions[sub.experimentId] = { progress: sub.progress, subscribedAt: sub.subscribedAt };
                }

                state.subscriptions = subscriptions;
            })
            .addCase(boot.rejected, (state) => {
                // Failed to boot for whatever reason, we set authenticated to false

                state.subscriptions = {};
                state.enrolled = false;
                delete state.id;
                delete state.deleted;
            })
            .addCase(logOut.fulfilled, (state) => {
                state.subscriptions = {};
                delete state.id;
                delete state.deleted;
                state.enrolled = false;
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
            })
            .addCase(updateProgress.fulfilled, (state, action) => {
                const progress = state.subscriptions[action.payload.experimentId].progress;

                progress[action.payload.dayId][action.payload.taskId] = true;
            });
    },
}).reducer;
