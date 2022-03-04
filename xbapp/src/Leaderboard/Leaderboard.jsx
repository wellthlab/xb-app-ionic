import "./Leaderboard.css";

import React from "react";
import {
  IonPage,
  IonContent,
  IonSpinner,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { chevronForwardOutline, chevronBackOutline } from "ionicons/icons";

import DailyLeaderboard from "./components/DailyLeaderboard";
import WeeklyLeaderboard from "./components/WeeklyLeaderboard";
import XBHeader from "../util/XBHeader";
import { addControllersProp } from "../util_model/controllers";
import dateFromTs from "../util_lib/dateFromTS";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getCurrentMonday = function () {
  const thisMonday = new Date();
  const today = new Date();
  const dayOfWeek = today.getDay();
  const normalisedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
  thisMonday.setDate(today.getDate() - (normalisedDayOfWeek - 1));
  thisMonday.setHours(0, 0, 0, 0);

  return thisMonday;
};

const Leaderboard = function ({ controllers }) {
  const [leaderboard, setLeaderboard] = React.useState([]);
  const [currentMonday, setCurrentMonday] = React.useState(getCurrentMonday());
  const [selectedDay, setSelectedDay] = React.useState(0); // -1 = view weekly

  const [loading, setLoading] = React.useState(true);
  const [fetchErrored, setFetchedErrored] = React.useState(false);

  const fetchTeamsForWeek = async function (currentMonday) {
    setLoading(true);
    setFetchedErrored(false);

    let result;
    let errored;
    try {
      result = await controllers.client.sortTeams(currentMonday);
    } catch (error) {
      errored = true;
      setFetchedErrored(true);
      console.error(error);
      return;
    } finally {
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
    fetchTeamsForWeek(currentMonday); // Use the initial monday state
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createHandleMoveWeek = function (direction) {
    return () => {
      const newMonday = new Date(currentMonday);
      newMonday.setDate(currentMonday.getDate() + direction * 7);

      setSelectedDay(0);
      setCurrentMonday(newMonday);
      fetchTeamsForWeek(newMonday);
    };
  };

  const createHandleDayChange = function (i) {
    return () => {
      setSelectedDay(i);
    };
  };

  let content;

  if (loading) {
    content = <IonSpinner name="crescent" />;
  } else if (fetchErrored) {
    content = "Sorry, something went wrong";
  } else {
    content = (
      <>
        <div className="week-picker">
          <IonButton onClick={createHandleMoveWeek(-1)}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>

          <div className="week-range">
            {dateFromTs(currentMonday)} -{" "}
            {dateFromTs(
              new Date(currentMonday).setDate(currentMonday.getDate() + 6)
            )}
          </div>

          <IonButton
            onClick={createHandleMoveWeek(1)}
            disabled={currentMonday.getTime() === getCurrentMonday().getTime()}
          >
            <IonIcon icon={chevronForwardOutline} />
          </IonButton>
        </div>

        <div className="day-picker">
          {daysOfWeek.map((day, i) => (
            <IonButton
              key={day}
              fill="clear"
              disabled={selectedDay === i}
              onClick={createHandleDayChange(i)}
            >
              {day}
            </IonButton>
          ))}

          <IonButton
            fill="clear"
            disabled={selectedDay === -1}
            onClick={createHandleDayChange(-1)}
          >
            Week
          </IonButton>
        </div>

        {selectedDay === -1 ? (
          <WeeklyLeaderboard leaderboard={leaderboard} />
        ) : (
          <DailyLeaderboard leaderboard={leaderboard[selectedDay]} />
        )}
      </>
    );
  }

  return (
    <IonPage>
      <XBHeader title="Teams Leaderboard" />
      <IonContent>{content}</IonContent>
    </IonPage>
  );
};

export default addControllersProp(Leaderboard);
