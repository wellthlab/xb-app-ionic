import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { hydrateAccount, logOutUser } from './account';
import Team, { ITeam } from '../models/Team';

export const createTeam = createAsyncThunk('team/created', (name: string) => {
    return Team.create(name);
});

export const joinTeam = createAsyncThunk('team/joined', (invite: string) => {
    return Team.join(invite);
});

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
        builder
            .addCase(hydrateAccount.fulfilled, (_, action) => {
                if (action.payload.team) {
                    return action.payload.team;
                }
            })
            .addCase(createTeam.fulfilled, (_, action) => action.payload)
            .addCase(joinTeam.fulfilled, (_, action) => action.payload)
            .addCase(logOutUser.fulfilled, () => null);
    },
}).reducer;
