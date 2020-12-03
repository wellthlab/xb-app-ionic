import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    teams: [
    ],
    fetching: false
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

            // TODO: Add experiment information to each group

            // TODO: Calculate things like overdue entries, day number

        }
    }
})

export const { CLEAR_TEAMS, SET_TEAMS } = TeamSlice.actions

export default TeamSlice.reducer
