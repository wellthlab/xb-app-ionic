import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';
import Account, { ICredentials, IProfile, ISubscription, ICohort } from '../models/Account';
import Experiment, { IResponse, GenericExperiment } from '../models/Experiment';

export const authenticateUser = createAsyncThunk('account/authenticated', (credentials: ICredentials) => {
    return Account.authenticate(credentials);
});

export const registerUser = createAsyncThunk('account/registered', (credentials: ICredentials) => {
    return Account.create(credentials);
});

export const updateUserProfile = createAsyncThunk<
    { profile: IProfile, cohort: ICohort },
    { payload: Omit<IProfile, 'email'>,  cohortId?: string | null}> (
    'account/profile/updated',
    ({ payload, cohortId }) => {
        return Account.updateProfile(payload, cohortId);
    },
);

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

export const subscribeToExperiments = createAsyncThunk<
    ISubscription[],
    GenericExperiment[]>('account/subscriptions', (experiments) => {
    const newSubscriptions  = getNewSubscriptions(experiments, Date.now());
    return Account.subscribeToExperiments(newSubscriptions);
});

export const getNewSubscriptions = (experimentsForSubscription: GenericExperiment[], currTimeUTC: number) => {
    const newSubscriptions:  Omit <ISubscription, 'id'>[] = [];

    for (const experiment of experimentsForSubscription) {
        if ('children' in experiment) {
            experiment
                .children
                .forEach((child) => {
                    newSubscriptions.push({
                        experimentId: child,
                        subscribedAt: currTimeUTC
                    });
                })
        } else {
            newSubscriptions.push({
                experimentId: experiment.id,
                subscribedAt: currTimeUTC
            });
        }
    }
    return newSubscriptions;
}

export const flagResponsesInactive = async (subscriptions: ISubscription[]) => {

    const subscriptionIds = Object.values(subscriptions).map(subscription => subscription.id);
    await Experiment.flagResponsesInactive(subscriptionIds);
}

export const markAccountAsDeleted = createAsyncThunk('account/deleted', async () => {
    return Account.markAsDeleted();
});

interface IAccountState {
    id?: string;
    profile?: IProfile;
    subscriptions: Record<string, ISubscription>;
    responses: Record<string, IResponse[]>,
    notes?: Record<number, string>,
    deleted?: boolean;
    cohort?: ICohort
}

export interface ISelectorState {
    account: IAccountState;
}

export const selectIsAuthenticated = (state: ISelectorState) => !!state.account.id;

export const selectIsEnrolled = (state: ISelectorState) => !!state.account.profile;

export const selectProfile = (state: ISelectorState) => state.account.profile;

export const isUserInCohort = (state: ISelectorState) => !(state.account.cohort == null);
export const selectCohortId = (state: ISelectorState) => state.account.cohort?.id;
export const selectCohort = (state: ISelectorState) => state.account.cohort;
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
    initialState: { id: Account.persistedId, subscriptions: {}, responses: {}, notes: {}, cohort: {} } as IAccountState,
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
                state.subscriptions = {};

                for (const sub of action.payload.subscriptions) {
                    state.subscriptions[sub.experimentId] = sub;
                }

                if (action.payload.account) {
                    state.profile = action.payload.account.profile;
                    state.notes = action.payload.account.notes;
                }

                if (action.payload.cohort) {
                    state.cohort = action.payload.cohort;
                }
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.profile = action.payload.profile;
                state.cohort = action.payload.cohort;
            })
            .addCase(boot.rejected, (state) => {
                // Failed to boot for whatever reason, we set authenticated to false

                state.subscriptions = {};
                state.responses = {};
                delete state.cohort;
                delete state.id;
                delete state.profile;
                delete state.deleted;
                delete state.notes;
            })
            .addCase(logOut.fulfilled, (state) => {

                state.subscriptions = {};
                state.responses = {};
                delete state.cohort;
                delete state.id;
                delete state.profile;
                delete state.deleted;
                delete state.notes;
            })
            .addCase(subscribeToExperiments.fulfilled, (state, action) => {
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
