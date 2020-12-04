import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    teams: [
    ],
    fetching: false,
    joining: false,
    join_err: false
};

/**
 * The experiment slice handles experiments that the user is part of.
 * ALL experiments are actually groups; even if the user is the only member!
 * So this slice most closely relates to the "group" collection in MongoDB
 *
 */
const TeamSlice = createSlice({
    name: 'teams',
    initialState,
    reducers: {
        CLEAR_TEAMS(state, action) {
            state.fetching = true;
            state.teams = [];
        },
        // Add an experiment to the list
        SET_TEAMS(state, action) {
            const teams = action.payload.teams;
            console.log("Set teams", teams);
            state.teams = teams;
            state.fetching = false;

            // TODO: Calculate things like overdue entries, day number

        },

        START_JOIN_TEAM(state, action) {
            state.joining = true;
            state.join_err = false;
        },
        CLEAR_JOIN_TEAM(state, action) {
            state.joining = false;
            state.join_err = false;
        },
        ABORT_JOIN_TEAM(state, action) {
            state.joining = false;
            state.join_err = action.payload;
        },

        START_CREATE_TEAM(state, action) {
            state.creating = true;
            state.create_err = false;
        },
        CLEAR_CREATE_TEAM(state, action) {
            state.creating = false;
            state.create_err = false;
        },
        ABORT_CREATE_TEAM(state, action) {
            state.creating = false;
            state.create_err = action.payload;
        },
    }
})

export const { CLEAR_TEAMS, SET_TEAMS, START_JOIN_TEAM, CLEAR_JOIN_TEAM, ABORT_JOIN_TEAM, START_CREATE_TEAM, CLEAR_CREATE_TEAM, ABORT_CREATE_TEAM } = TeamSlice.actions

export default TeamSlice.reducer
