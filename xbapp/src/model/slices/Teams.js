import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    teams: [
    ],
    fetching: false,
    joining: false,
    join_err: false
};


/**
 * Some helpers
 */
// Get the number of day, assuming experiment starts on start
function dayNumber(date, start) {
    var diff = date - start;
    var day = Math.ceil(diff / 1000 / 3600 / 24);
    //console.log("Day Number", date, start, day);
    return day;
}

// Organise a list of responses into daily entries
function dayify(responses, start, minday, maxday) {
    var entries = [];

    // First, organise by day
    for(var r of responses) {
        var day = dayNumber(r.date, start);

        if(day > 100) {
            throw "Yikes, big day = error...";
        }

        minday = Math.min(minday, day);
        maxday = Math.max(maxday, day);

        if(typeof entries[day] == 'undefined') {
            entries[day] = [];
        }

        entries[day].push(r);
    }

    console.log(minday, maxday, entries);

    // Then generate each daily entry
    for(var i = minday; i <= maxday; i++) {
        console.log("Process day", i);
        if(typeof entries[i] == 'undefined') {
            // TODO: Missing should be per-question
            entries[i] = {day: i, missing: true, responses: []}
        } else {
            entries[i] = {day: i, missing: false, responses: entries[i]}
        }
    }

    return entries;
}

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
            state.teams = teams;
            state.fetching = false;

            // Add extra info to each teams
            for(var i in state.teams) {
                var team = state.teams[i];

                // Day number
                team.experiment.day = dayNumber(new Date(), new Date(team.experiment.start));

                // Compile responses into daily entries
                team.entries = dayify(team.responses.own.responses, team.experiment.start, -14, team.experiment.day);
            }

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
