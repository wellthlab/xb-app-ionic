import React from "react";

import TeamList from "./TeamList";

const convertToWeeklyLeaderboard = function (leaderboard) {
  const teams = {};

  for (let i = 0; i < leaderboard.length; i++) {
    const day = leaderboard[i];
    if (!day) {
      continue;
    }

    for (const team of day.teams) {
      let entry = teams[team._id];
      if (!entry) {
        teams[team._id] = entry = {
          ...team,
          overall: {
            minutes: 0,
            cappedMinutes: 0,
            target: 0,
            completion: 0,
            dailyBreakdown: [],
          },
        };
      }

      entry.overall.minutes += team.overall.minutes;
      entry.overall.cappedMinutes += team.overall.cappedMinutes;
      entry.overall.target += team.overall.target;
      entry.overall.completion =
        entry.overall.cappedMinutes / entry.overall.target;
      entry.overall.dailyBreakdown[i] = team.overall.completion;
    }
  }

  const res = Object.values(teams).sort((a, b) => {
    if (a.overall.completion === b.overall.completion) {
      return b.overall.cappedMinutes - a.overall.cappedMinutes;
    }

    return b.overall.completion - a.overall.completion;
  });

  console.log(res);
  return res;
};

const WeeklyLeaderboard = function ({ leaderboard }) {
  const weeklyLeaderboard = convertToWeeklyLeaderboard(leaderboard);

  return !weeklyLeaderboard.length ? (
    "Oops, there's nothing to show for the selected week"
  ) : (
    <TeamList teams={weeklyLeaderboard} />
  );
};

export default WeeklyLeaderboard;
