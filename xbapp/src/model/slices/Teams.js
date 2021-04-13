import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teams: [],
  fetching: false,
  loaded: false,
  joining: false,
  join_err: false,
};

var _ = require("lodash");
var dateFormat = require("dateformat");

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
  var entriesByDay = {};
  for (var r of responses) {
    var day = r.day;

    minday = Math.min(minday, day);
    maxday = Math.max(maxday, day);

    if (typeof entriesByDay[day] == "undefined") {
      entriesByDay[day] = [];
    }

    entriesByDay[day].push(r);
  }

  var startDate = new Date( Date.parse(start) );
  //console.log("Compiling daily summary. Start date", start, startDate);
  function addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      //console.log("Add days to date", days, date, result);
      return result;
  }

  // Then generate each daily entry
  for (var i = minday; i <= maxday; i++) {
    var date = dateFormat(addDays(startDate, i), "ddd d mmm");

    if (typeof entriesByDay[i] == "undefined") {
      // TODO: Missing should be per-question
      entries.push({ day: i, date: date, missing: true, responses: [] });
    } else {
      entries.push({ day: i, date: date, missing: false, responses: entriesByDay[i] });
    }
  }

  entries.sort(function (a, b) {
    return a.day - b.day;
  });

  // Add daily summaries
  // TODO: This needs to go somewhere else longer-term so that the store isn't so coupled to particular experiments
  for (var day of entries) {
    var mins = 0;
    day.responseTypes = {};

    //console.log("Generate summary for", day);
    for (var res of day.responses) {

      // Make a list of answered question types
      day.responseTypes[res.type] = true;

      // Add minutes up
      if (res.type == "minutes") {
        mins = mins + 1 * res.minutes;
      }

    }

    day.minutes = mins;
    day.questionnaire = typeof day.responseTypes.questionnaire !== 'undefined'; // day.responseTypes is preferred, but this is for backward compatibility
  }

  return entries;
}

// From a list of experiment stages, pick the one that's active on the given day
function dayStage(day, stages) {
  var starts = Object.keys(stages);
  starts.sort(function (a, b) {
    return a * 1 - b * 1;
  });
  //console.log("Get active stage", day, stages, starts);

  var last = false;
  for (var start of starts) {
    start = start * 1; // Convert to number
    if (start > day) {
      return last;
    }
    last = start;
  }

  return last;
}

function getTeam(teams, id) {
  for (var t of teams) {
    if (t._id == id) {
      return t;
    }
  }
  return false;
}

/**
 * The experiment slice handles experiments that the user is part of.
 * ALL experiments are actually groups; even if the user is the only member!
 * So this slice most closely relates to the "group" collection in MongoDB
 *
 */
const TeamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    CLEAR_TEAMS(state, action) {
      state.fetching = false;
      state.teams = [];
      state.loaded = false;
    },
    // Add an experiment to the list
    SET_TEAMS(state, action) {
      const teams = action.payload.teams;
      state.teams = teams;
      state.fetching = false;
      state.loaded = true;

      // Add extra info to each teams
      for (var i in state.teams) {
        var team = state.teams[i];

        // Day number
        team.experiment.day = dayNumber(
          new Date(),
          new Date(team.experiment.start)
        );

        // Current experiment phase info
        var stage = dayStage(team.experiment.day, team.experiment.info.stages);
        //console.log("Day", team.experiment.day, "Stages", team.experiment.info.stages);
        team.experiment.current_stage = team.experiment.info.stages[stage];

        // Compile responses into daily entries
        team.entries = dayify(
          team.responses.own.responses,
          team.experiment.start,
          1,
          Math.min(team.experiment.day, team.experiment.info.duration) // Don't exceed experment duration
        );
      }
    },

    /**
     * Team responses are fetched on demand
     */
    START_GET_TEAM_RESPONSES(state, action) {
      var teamid = action.payload.team;

      var team = getTeam(state.teams, teamid);
      if (team !== false) {
        team.responses.fetching = true;
      }
    },

    SET_TEAM_RESPONSES(state, action) {
      var teamid = action.payload.team;
      var responses = action.payload.responses;

      var team = getTeam(state.teams, teamid);
      if (team === false) {
        console.error(
          "Tried to set team responses on non-existent team?",
          teamid
        );
        return;
      }

      // TODO: Pre-process the response data to generate e.g. summaries, totals....

      //number of days
      var dayData = team.entries;
      var minutesIndividualReplacer = [];
      var unweightedFeelingIndividualReplacer = [];
      var nrOfDayMinutes = [];
      var nrOfDayMood = [];
      var groupMinutesAverages = [];
      var groupMoodAverages = [];
      var groupMinutesSums = [];
      var groupMoodSums = [];

      for (var j = 0; j < dayData.length; j++) {
        minutesIndividualReplacer[j] = null;
        unweightedFeelingIndividualReplacer[j] = null;
        nrOfDayMinutes[j] = 0;
        nrOfDayMood[j] = 0;
        groupMinutesAverages[j] = null;
        groupMoodAverages[j] = null;
        groupMinutesSums[j] = null;
        groupMoodSums[j] = null;
      }

      for (var h = 0; h < responses.length; h++) {
        //goes through each user
        var userResponse = responses[h];
        //console.log("USER", userResponse);
        var minutesIndividual = minutesIndividualReplacer.slice();
        var unweightedFeelingIndividual = unweightedFeelingIndividualReplacer.slice();

        //iterating through all responses
        for (var i = 0; i < userResponse.responses.length; i++) {
          var eachEntry = userResponse.responses[i];
          //add minutes to corresponding day
          //see if entries contain days

          //if minutes or mood
          if (_.has(eachEntry, "minutes")) {
            //the response is a minutes
            var correspondingDay = parseInt(eachEntry.day) - 1;
            if (minutesIndividual[correspondingDay] == null) {
              minutesIndividual[correspondingDay] = parseInt(eachEntry.minutes);
              nrOfDayMinutes[correspondingDay] += 1;
            } else {
              minutesIndividual[correspondingDay] += parseInt(
                eachEntry.minutes
              );
            }
          } else {
            //the response is a mood
            var correspondingDay = parseInt(eachEntry.day) - 1;
            unweightedFeelingIndividual[correspondingDay] = parseInt(
              eachEntry.mood
            );
            nrOfDayMood[correspondingDay] += 1;
          }
        }
        //process feeling data with averaged weights making use of unweightedFeelingIndividual

        var feelingIndividual = [];
        let perceptionMovingAverage = 0;
        for (let eachMood of unweightedFeelingIndividual) {
          if (eachMood != null) {
            let currentValue = eachMood * 0.85;

            currentValue += perceptionMovingAverage * 0.15;

            perceptionMovingAverage = currentValue;
            feelingIndividual.push(currentValue.toFixed(2));
          } else {
            perceptionMovingAverage = 0;
            feelingIndividual.push(eachMood);
          }
        }

        for (var k = 0; k < unweightedFeelingIndividual.length; k++) {
          if (minutesIndividual[k] != null) {
            groupMinutesSums[k] += parseInt(minutesIndividual[k]);
          }
          if (feelingIndividual[k] != null) {
            groupMoodSums[k] += parseInt(feelingIndividual[k]);
          }
        }
      }
      for (var y = 0; y < groupMinutesAverages.length; y++) {
        if (groupMinutesSums[y] != null) {
          groupMinutesAverages[y] =
            parseInt(groupMinutesSums[y]) / parseInt(nrOfDayMinutes[y]);
        }
        if (groupMoodSums[y] != null) {
          groupMoodAverages[y] =
            parseInt(groupMoodSums[y]) / parseInt(nrOfDayMood[y]);
        }
      }

      team.responses.groupMinuteAverage = groupMinutesAverages;
      team.responses.groupMoodAverage = groupMoodAverages;
      team.responses.fetching = false;
      team.responses.all = responses;
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
  },
});

export const {
  CLEAR_TEAMS,
  SET_TEAMS,
  START_GET_TEAM_RESPONSES,
  SET_TEAM_RESPONSES,
  START_JOIN_TEAM,
  CLEAR_JOIN_TEAM,
  ABORT_JOIN_TEAM,
  START_CREATE_TEAM,
  CLEAR_CREATE_TEAM,
  ABORT_CREATE_TEAM,
} = TeamSlice.actions;

export default TeamSlice.reducer;
