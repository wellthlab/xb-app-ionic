import { createSlice } from '@reduxjs/toolkit';

import { hydrateAccount } from './account';
import { ITeam } from '../models/Team';

type TeamState = ITeam | null;

interface ISelectorState {
    team: TeamState;
}

export const selectTeam = (state: ISelectorState) => state.team;

export default createSlice({
    name: 'team',
    initialState: null as TeamState,
    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(hydrateAccount.fulfilled, (_, action) => {
            if (action.payload.team) {
                return action.payload.team;
            }
        });
    },
}).reducer;
