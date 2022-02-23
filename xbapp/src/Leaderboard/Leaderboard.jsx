import React from 'react';
import { IonPage, IonContent, IonSpinner, IonButton, IonIcon } from '@ionic/react';
import { chevronForwardOutline, chevronBackOutline } from 'ionicons/icons';

import DailyLeaderboard from './components/DailyLeaderboard';
import WeeklyLeaderboard from './components/WeeklyLeaderboard';
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

const Leaderboard = function ({ controllers }) {
  const [leaderboard, setLeaderboard] = React.useState([]);
  const [weekDirection, setWeekDirection] = React.useState(0);
  const [viewWeekly, setViewWeekly] = React.useState(false);

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

      const currentMonday = getCurrentMonday();
      const newMonday = currentMonday.setDate(currentMonday.getDate() + newDirection * 7);
      fetchTeamsForWeek(newMonday);
    };
  };

  const handleChangeViewMode = function () {

    setViewWeekly(!viewWeekly);
  };

  let content;

  if (loading) {
    content = <IonSpinner name="crescent" />
  }
  else if (fetchErrored) {
    content = 'Sorry, something went wrong';
  }
  else {
    content = (
      <>
        <div>
          <IonButton onClick={handleChangeViewMode}>
            {viewWeekly ? 'Daily leaderboard' : 'Weekly leaderboard'}
          </IonButton>

          <IonButton onClick={createHandleMoveWeek(-1)}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>

          <IonButton onClick={createHandleMoveWeek(1)} disabled={!weekDirection}>
            <IonIcon icon={chevronForwardOutline} />
          </IonButton>
        </div>
        {viewWeekly ? <WeeklyLeaderboard leaderboard={leaderboard} /> : <DailyLeaderboard leaderboard={leaderboard} />}
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
