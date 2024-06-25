import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { updateUserProfile } from './account';
import { IProfile } from '../models/Account';

interface IOnboardingState {
    cohortId: string | null;
    profile: Omit<IProfile, 'id' | 'email'> | null;
}

interface ISelectorState {
    onboarding: IOnboardingState;
}

export const selectOnboardingState = (state: ISelectorState) => state.onboarding;

const slice = createSlice({
    name: 'onboarding',
    initialState: {
        profile: null,
        cohortId: null,
    } as IOnboardingState,

    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
        },

        setCohortId: (state, action: PayloadAction<string>) => {
            state.cohortId = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(updateUserProfile.fulfilled, () => ({ profile: null, cohortId: null }));
    },
});

export default slice.reducer;

export const setProfile = slice.actions.setProfile;
export const setCohortId = slice.actions.setCohortId;
