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

    console.log("Dayifying responses", responses);

    // First, organise by day
    var entriesByDay = {};
    for(var r of responses) {
        //var subdate = new Date(r.submitted);
        //var day = dayNumber(subdate, new Date(start));
        var day = r.day;

        minday = Math.min(minday, day);
        maxday = Math.max(maxday, day);

        if(typeof entriesByDay[day] == 'undefined') {
            entriesByDay[day] = [];
        }

        entriesByDay[day].push(r);
    }

    console.log("Dayified", entries);

    // Then generate each daily entry
    for(var i = minday; i <= maxday; i++) {
        console.log("Process day", i);
        if(typeof entriesByDay[i] == 'undefined') {
            // TODO: Missing should be per-question
            entries.push( {day: i, missing: true, responses: []} )
        } else {
            entries.push( {day: i, missing: false, responses: entriesByDay[i]} )
        }
    }

    entries.sort(function(a, b){
        return a.day - b.day;
    });

    // Add daily summaries
    // TODO: This needs to go somewhere else longer-term so that the store isn't so coupled to particular experiments
    for(var day of entries) {
        var mins = 0;
        var questionnaired = false;
        console.log("Generate summary for", day);
        for(var res of day.responses) {
            if(res.type =='minutes') {
                mins = mins + 1 * res.minutes;
            } else if(res.type == 'questionnaire') {
                questionnaired = true;
            }
        }

        day.minutes = mins;
        day.questionnaire = questionnaired;
    }

    return entries;
}

// From a list of experiment stages, pick the one that's active on the given day
function dayStage(day, stages) {

    var starts = Object.keys(stages);
    starts.sort(function(a, b){
        return a * 1 - b * 1;
    });
    //console.log("Get active stage", day, stages, starts);

    var last = false;
    for(var start of starts) {
        start = start * 1; // Convert to number
        if(start > day) {
            return last;
        }
        last = start;
    }

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

                // Current experiment phase info
                team.experiment.current_stage = team.experiment.info.stages[dayStage(team.experiment.day, team.experiment.info.stages)];

                // Compile responses into daily entries
                team.entries = dayify(team.responses.own.responses, team.experiment.start, 1, team.experiment.day);
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
