import './Leaderboard.css';

import React from 'react';
import { IonContent, IonSpinner, IonButton, IonCard } from '@ionic/react';

import Podium from './components/Podium';
import XBHeader from '../util/XBHeader';
import { addControllersProp } from '../util_model/controllers';

const getCurrentMonday = function () {

  const thisMonday = new Date();
  const today = new Date();
  const dayOfWeek = today.getDay();
  const normalisedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
  thisMonday.setDate(today.getDate() - (normalisedDayOfWeek - 1));

  return thisMonday;
};

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Leaderboard = function ({ controllers }) {
  const [leaderboard, setLeaderboard] = React.useState([]);
  const [monday, setMonday] = React.useState(1644797132263);
  const [selectedDay, setSelectedDay] = React.useState(0);

  const [loading, setLoading] = React.useState(true);
  const [fetchErrored, setFetchedErrored] = React.useState(false);

  const fetchTeamsForWeek = async function (currentMonday) {

    setLoading(true);
    setFetchedErrored(false);

    let result;
    let errored;
    try {
      result = await controllers.client.sortTeams(currentMonday);
    }
    catch (error) {
      errored = true;
      setFetchedErrored(true);
      console.error(error);
      return;
    }
    finally {
      setLoading(false);
    }

    if (errored) {
      return;
    }

    const parsed = JSON.parse(result);
    console.log(parsed, result);
    setLeaderboard(parsed);
  };

  React.useEffect(() => {
    fetchTeamsForWeek(monday);        // Use the initial monday state
  }, []);

  const createHandleDayOfWeekChange = function (i) {

    return () => {

      setSelectedDay(i);
    };
  }

  let content;

  if (loading) {
    content = <IonSpinner name="crescent" />
  }
  else if (fetchErrored) {
    content = 'Sorry, something went wrong';
  }
  else {
    let subcontent;

    if (!leaderboard.length) {
      subcontent = 'Oops, there\'s nothing to show for the selected week';
    }
    else {
      const currentLeaderboard = leaderboard[selectedDay].teams;

      if (!currentLeaderboard.length) {
        subcontent = 'Oops, there\'s nothing to show for the selected day';
      }
      else {
        const firstThree = currentLeaderboard.slice(0, 3).map((team) => ({
          label: team.name,
          value: Math.round(team.overallCompletion)
        }));

        const remaining = currentLeaderboard.slice(3);

        subcontent = (
          <>
            <Podium items={firstThree} />
            {remaining.length && (
              <div className="team-list">
                {remaining.map((team, i) => (
                  <IonCard key={team._id}>{team.name}</IonCard>
                ))}
              </div>
            )}
          </>
        )
      }
    }

    content = (
      <>
        <div className="day-picker">
          <IonButton>Last week</IonButton>
          {daysOfWeek.map((day, i) => (
            <IonButton key={day} fill="clear" disabled={selectedDay === i} onClick={createHandleDayOfWeekChange(i)}>{day}</IonButton>
          ))}
          <IonButton>Next week</IonButton>
        </div>
        {subcontent}
      </>
    );
  }

  return (
    <>
      <XBHeader title="Teams Leaderboard" />
      <IonContent>
        {content}
      </IonContent>
    </>
  );
};

export default addControllersProp(Leaderboard);
