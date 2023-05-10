import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';
import Team, { ITeam } from '../models/Team';

export const createTeam = createAsyncThunk('team/created', (payload: Pick<ITeam, 'name' | 'desc'>) => {
    return Team.create(payload);
});

export const joinTeam = createAsyncThunk('team/joined', (invite: string) => {
    return Team.join(invite);
});

export const leaveTeam = createAsyncThunk('team/left', () => {
    return Team.leave();
});

type TeamState = ITeam | null;

interface ISelectorState {
    team: TeamState;
}

export const selectTeam = (state: ISelectorState) => state.team;
export const selectTeamMembers = (state: ISelectorState) => state.team?.members;

export default createSlice({
    name: 'team',
    initialState: null as TeamState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(boot.fulfilled, (_, action) => action.payload.team)
            .addCase(logOut.fulfilled, () => null)
            .addCase(leaveTeam.fulfilled, () => null)
            .addCase(createTeam.fulfilled, (_, action) => action.payload)
            .addCase(joinTeam.fulfilled, (_, action) => action.payload);
    },
}).reducer;
