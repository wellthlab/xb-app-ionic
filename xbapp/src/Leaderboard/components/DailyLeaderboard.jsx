import './DailyLeaderboard.css';

import React from 'react';
import { IonButton } from '@ionic/react';

import TeamList from './TeamList';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DailyLeaderboard = function ({ leaderboard }) {
  const [selectedDay, setSelectedDay] = React.useState(0);

  const createHandleDayOfWeekChange = function (i) {

    return () => {

      setSelectedDay(i);
    };
  }

  return (
    <>
      <div className="day-picker">
        {daysOfWeek.map((day, i) => (
          <IonButton
            key={day}
            fill="clear"
            disabled={selectedDay === i}
            onClick={createHandleDayOfWeekChange(i)}
          >
            {day}
          </IonButton>
        ))}
      </div>
      {!leaderboard[selectedDay]
        ? 'Oops, there\'s nothing to show for the selected day'
        : (
          <TeamList teams={leaderboard[selectedDay].teams} />
        )
      }
    </>
  );
};

export default DailyLeaderboard;
