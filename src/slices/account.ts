import { createSlice, createAsyncThunk, ThunkDispatch } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';
import Account, { ICredentials, IProfile, IAccount, ISubscription, ISubscriptionSequence } from '../models/Account';
import Experiment, { IResponse, GenericExperiment, IExperiment } from '../models/Experiment';
import { selectAllExperiments, ISelectorState as IExperimentState } from './experiments';

export const authenticateUser = createAsyncThunk('account/authenticated', (credentials: ICredentials) => {
    return Account.authenticate(credentials);
});

export const registerUser = createAsyncThunk('account/registered', (credentials: ICredentials) => {
    return Account.create(credentials);
});

export const updateUserProfile = createAsyncThunk<
    Omit<IAccount, 'id' | 'subscriptions' | 'notes'>,
    { payload: Omit<IProfile, 'id' | 'email'>; cohortId?: string | null }
>('account/profile/updated', ({ payload, cohortId }) => {
    return Account.updateProfile(payload, cohortId);
});

export const reloadResponses = createAsyncThunk('account/reloadResponses', async (accountSubscriptions: string[]) => {
    return Experiment.getResponses(accountSubscriptions);
});

export const saveNotes = createAsyncThunk('account/saveNote', async (notes: Record<number, string>) => {
    return Account.saveNotes(notes);
});

export const saveSubscriptionSequence = createAsyncThunk<
    ISubscriptionSequence,
    { experimentsByBoxWeek: Map<number, GenericExperiment[]>; boxId: string; orderedBoxWeeks: number[] }
>('account/saveSubscriptionSequence', async ({ boxId, experimentsByBoxWeek, orderedBoxWeeks }) => {
    return Account.saveSubscriptionSequence(experimentsByBoxWeek, boxId, orderedBoxWeeks);
});

export const subscribeToExperiments = createAsyncThunk<ISubscription[], GenericExperiment[]>(
    'account/subscriptions',
    (experiments) => {
        const subscribedAt = Date.now();
        const recordsForInsertion: Omit<ISubscription, 'id'>[] = [];

        for (const experiment of experiments) {
            if ('children' in experiment) {
                experiment.children.forEach((child) => {
                    recordsForInsertion.push({
                        experimentId: child,
                        subscribedAt: subscribedAt,
                    });
                });
            } else {
                recordsForInsertion.push({
                    experimentId: experiment.id,
                    subscribedAt: subscribedAt,
                });
            }
        }
        return Account.subscribeToExperiments(recordsForInsertion);
    },
);

export const unSubscribeFromBox = async (
    subscriptionIds: string[],
    boxId: string,
    continueRemindersForAccount: boolean,
) => {
    await Promise.all([
        Account.removeAccountSubscriptions(subscriptionIds),
        Account.deleteSubscriptionSequence(boxId),
        Experiment.deleteResponses(subscriptionIds),
        Account.deleteSubscriptions(subscriptionIds),
        !continueRemindersForAccount ? Account.deletePendingNotifications() : Promise.resolve({}),
    ]);
};

export const shouldContinueRemindersForAccount = (
    allSubscriptions: Record<string, ISubscription>,
    allExperiments: Record<string, GenericExperiment>,
    allResponses: Record<string, IResponse[]>,
) => {
    for (const [experimentId, subscription] of Object.entries(allSubscriptions)) {
        const experiment = allExperiments[experimentId];
        const responses = allResponses[subscription.id];
        if (!responses && (experiment as IExperiment).shouldSendReminders) {
            return true;
        }

        if (!('children' in experiment)) {
            const originalLength = experiment.days.length;
            if (originalLength < experiment.duration) {
                let day = 0;

                for (let i = 0; i < experiment.duration - originalLength; i++) {
                    experiment.days.push(experiment.days[day]);
                    day++;

                    if (day === originalLength) {
                        day = 0;
                    }
                }
            }
        }

        let isFinished = true;

        // @ts-ignore
        taskLoop: for (const [dayIndex, day] of (experiment as IExperiment).days.entries()) {
            for (const task of day.tasks) {
                if (day.tasks.length === 0) {
                    continue;
                }
                if (
                    !responses.some(
                        (response) =>
                            response.taskId.toString() === task.taskId.toString() && response.dayNum === dayIndex,
                    )
                ) {
                    isFinished = false;
                    break taskLoop;
                }
            }
        }

        if (!isFinished && (experiment as IExperiment).shouldSendReminders) {
            return true;
        }
    }

    return false;
};
export const subScribeToBox = (
    dispatch: ThunkDispatch<any, any, any>,
    experimentsByBoxWeek: Map<number, GenericExperiment[]>,
    boxId: string,
) => {
    const orderedBoxWeeks = Array.from(experimentsByBoxWeek.keys()).sort();
    const firstBoxWeekExperiments = experimentsByBoxWeek.get(orderedBoxWeeks[0]);
    dispatch(subscribeToExperiments(firstBoxWeekExperiments!));
    dispatch(saveSubscriptionSequence({ experimentsByBoxWeek, boxId, orderedBoxWeeks }));
};

export const markAccountAsDeleted = createAsyncThunk('account/deleted', async () => {
    return Account.markAsDeleted();
});

interface IAccountState {
    id?: string;
    profile?: IProfile;
    cohortId?: string;
    subscriptions: Record<string, ISubscription>;
    responses: Record<string, IResponse[]>;
    subscriptionSequence: Record<string, ISubscriptionSequence>;
    notes?: Record<number, string>;
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

export const selectSubscriptionByExperimentId = (state: ISelectorState, experimentId: string) =>
    state.account.subscriptions[experimentId];

export const selectNotes = (state: ISelectorState) => (state.account.notes ? state.account.notes : {});

export const selectUserId = (state: ISelectorState) => state.account.id;

export const selectSubscriptionSequenceByBoxId = (state: ISelectorState & IExperimentState, boxId: string) => {
    const experiments = selectAllExperiments(state);
    const subscriptionSequence = state.account.subscriptionSequence[boxId];
    const subSeqMap = new Map<number, GenericExperiment[]>();

    if (subscriptionSequence) {
        for (let i = 0; i < subscriptionSequence.experimentSequence.length; i++) {
            const experimentsForBoxWeek = subscriptionSequence.experimentSequence[i].map(
                (experimentId) => experiments[experimentId],
            );
            subSeqMap.set(subscriptionSequence.orderedBoxWeeks[i], experimentsForBoxWeek);
        }
    }
    return subSeqMap;
};

export const selectResponses = (state: ISelectorState) => state.account.responses;

export default createSlice({
    name: 'account',
    initialState: {
        id: Account.persistedId,
        subscriptions: {},
        responses: {},
        notes: {},
        subscriptionSequence: {},
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
                state.responses = action.payload.responses;
                state.subscriptions = {};
                state.subscriptionSequence = {};

                for (const subSeq of action.payload.subscriptionSequences) {
                    state.subscriptionSequence[subSeq.boxId] = subSeq;
                }
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
                state.subscriptionSequence = {};
                delete state.cohortId;
                delete state.id;
                delete state.profile;
                delete state.deleted;
                delete state.notes;
            })
            .addCase(logOut.fulfilled, (state) => {
                state.subscriptions = {};
                state.responses = {};
                state.subscriptionSequence = {};
                delete state.cohortId;
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
            .addCase(saveSubscriptionSequence.fulfilled, (state, action) => {
                state.subscriptionSequence[action.payload.boxId] = action.payload;
            })
            .addCase(reloadResponses.fulfilled, (state, action) => {
                state.responses = action.payload;
            });
    },
}).reducer;
