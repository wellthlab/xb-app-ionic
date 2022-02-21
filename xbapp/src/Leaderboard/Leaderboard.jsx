import './Leaderboard.css';

import React from 'react';
import { IonPage, IonContent, IonSpinner, IonButton, IonIcon } from '@ionic/react';
import { chevronForwardOutline, chevronBackOutline } from 'ionicons/icons';

import Podium from './components/Podium';
import TeamCard from './components/TeamCard';
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
  const [weekDirection, setWeekDirection] = React.useState(0);
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
    fetchTeamsForWeek(getCurrentMonday());        // Use the initial monday state
  }, []);

  const createHandleMoveWeek = function (direction) {

    return () => {

      const newDirection = weekDirection + direction;
      setWeekDirection(newDirection);
      setSelectedDay(0);

      const currentMonday = getCurrentMonday();
      const newMonday = currentMonday.setDate(currentMonday.getDate() + newDirection * 7);
      fetchTeamsForWeek(newMonday);
    };
  };

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
      if (!leaderboard[selectedDay]) {
        subcontent = 'Oops, there\'s nothing to show for the selected day';
      }
      else {
        const currentLeaderboard = leaderboard[selectedDay].teams;
        const firstThree = currentLeaderboard.slice(0, 3);
        const remaining = currentLeaderboard.slice(3);

        subcontent = (
          <>
            <Podium teams={firstThree} />

            {remaining.length && (
              <div className="team-list">
                {remaining.map((team, i) => (
                  <TeamCard key={team._id} team={team} order={4 + i} />
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
          <IonButton onClick={createHandleMoveWeek(-1)}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>

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

          <IonButton onClick={createHandleMoveWeek(1)} disabled={!weekDirection}>
            <IonIcon icon={chevronForwardOutline} />
          </IonButton>
        </div>
        {subcontent}
      </>
    );
  }

  return (
    <IonPage>
      <XBHeader title="Teams Leaderboard" />
      <IonContent>
        {content}
      </IonContent>
    </IonPage>
  );
};

export default addControllersProp(Leaderboard);
