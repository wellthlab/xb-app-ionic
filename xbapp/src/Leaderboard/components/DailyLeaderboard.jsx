import React from 'react';

import TeamList from './TeamList';

const DailyLeaderboard = function ({ leaderboard }) {

  return !leaderboard
    ? 'Oops, there\'s nothing to show for the selected day'
    : (
      <TeamList teams={leaderboard.teams} />
    );
};

export default DailyLeaderboard;
