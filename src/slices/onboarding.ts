import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { updateUserProfile } from './account';
import { IProfile } from '../models/Account';
import { IExperiment, IExperimentSchedule } from '../models/Experiment';

interface IOnboardingState {
    cohortId: string | undefined;
    profile: Omit<IProfile, 'id' | 'email'> | null;
    experimentsDueForSubscription: Record<number, IExperiment[]>;
    futureExperiments: IExperimentSchedule[]
}

interface ISelectorState {
    onboarding: IOnboardingState;
}

export const selectOnboardingState = (state: ISelectorState) => state.onboarding;

const slice = createSlice({
    name: 'onboarding',
    initialState: {
        profile: null,
        cohortId: undefined,
        experimentsDueForSubscription: {},
        futureExperiments: []
    } as IOnboardingState,

    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
        },

        setCohortId: (state, action: PayloadAction<string | undefined>) => {
            state.cohortId = action.payload;
        },

        setExperimentsDueForSubscription:(state, action) => {
            state.experimentsDueForSubscription = action.payload;
        },

        setFutureExperiments:(state, action) => {
            state.futureExperiments = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(updateUserProfile.fulfilled, () => ({ profile: null, cohortId: undefined, experimentsDueForSubscription: {}, futureExperiments: [] }));
    },
});

export default slice.reducer;

export const setProfile = slice.actions.setProfile;
export const setCohortId = slice.actions.setCohortId;

export const setExperimentsDueForSubscription = slice.actions.setExperimentsDueForSubscription;

export const setFutureExperiments = slice.actions.setFutureExperiments;
