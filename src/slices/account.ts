import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';
import Account, { ICredentials, IProfile, IAccount, ISubscription } from '../models/Account';
import Experiment, { IParentExperiment, IExperiment, IResponse } from '../models/Experiment';
import { selectAllExperiments, ISelectorState as IExperimentState } from './experiments';

export const authenticateUser = createAsyncThunk('account/authenticated', (credentials: ICredentials) => {
    return Account.authenticate(credentials);
});

export const registerUser = createAsyncThunk('account/registered', (credentials: ICredentials) => {
    return Account.create(credentials);
});

export const updateUserProfile = createAsyncThunk<
    Omit <IAccount, 'id' | 'subscriptions'| 'notes'>,
    { payload: Omit<IProfile, 'id' | 'email'>, cohortId: string | undefined }> (
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

export const reloadResponses = createAsyncThunk(
    'account/reloadResponses',
    async (accountSubscriptions: string []) => {
        return Experiment.getResponses(accountSubscriptions);
    },
);

export const saveNotes = createAsyncThunk(
    'account/saveNote',
    async (notes: Record<number, string>) => {
        return Account.saveNotes(notes);
    },
);

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

interface IAccountState {
    id?: string;
    profile?: IProfile;
    cohortId?: string;
    subscriptions: Record<string, ISubscription>;
    responses: Record<string, IResponse[]>,
    notes?: Record<number, string>,
    deleted?: boolean;
}

export interface ISelectorState {
    account: IAccountState;
}

export const selectIsAuthenticated = (state: ISelectorState) => !!state.account.id;

export const selectIsEnrolled = (state: ISelectorState) => !!state.account.profile;

export const selectProfile = (state: ISelectorState) => state.account.profile;

export const selectCohortId = (state: ISelectorState) => state.account.cohortId;
export const selectIsDeleted = (state: ISelectorState) => state.account.deleted;

export const selectSubscriptions = (state: ISelectorState) => state.account.subscriptions;

export const selectSubscriptionByExperimentId = (state: ISelectorState,  experimentId: string) => state.account.subscriptions[experimentId];

export const selectNotes = (state: ISelectorState) => state.account.notes ? state.account.notes: {};

export const selectUserId = (state: ISelectorState) => state.account.id;

export const selectDepartment = (state: ISelectorState) => state.account.profile?.department;

export const selectFullName = (state: ISelectorState) =>
    state.account.profile ? state.account.profile.firstName + ' ' + state.account.profile.lastName : null;

export const selectResponses = (state: ISelectorState) => state.account.responses;

export default createSlice({
    name: 'account',
    initialState: { id: Account.persistedId, subscriptions: {}, responses: {}, notes: {} } as IAccountState,
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
                    state.subscriptions[sub.experimentId] = sub;
                }
                if (action.payload.account) {
                    state.profile = action.payload.account.profile;
                    state.cohortId = action.payload.account.cohortId;
                    state.notes = action.payload.account.notes;
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
                delete state.notes;
            })
            .addCase(logOut.fulfilled, (state) => {

                state.subscriptions = {};
                state.responses = {};
                delete state.cohortId;
                delete state.id;
                delete state.profile;
                delete state.deleted;
                delete state.notes;
            })
            .addCase(subscribeToExperiment.fulfilled, (state, action) => {
                if (action.payload) {
                    state.subscriptions[action.payload.experimentId] =  action.payload;
                }
            })
            .addCase(subscribeToParentExperiment.fulfilled, (state, action) => {
                if (action.payload) {
                    for (const subscription of action.payload) {
                        state.subscriptions[subscription.experimentId] = subscription;
                    }
                }
            })
            .addCase(saveNotes.fulfilled, (state, action) => {
                state.notes = action.payload;
            })
            .addCase(reloadResponses.fulfilled, (state, action) => {
                state.responses = action.payload;
        });
    },
}).reducer;
