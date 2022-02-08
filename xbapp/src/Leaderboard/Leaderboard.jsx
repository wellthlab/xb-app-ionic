import React from "react";
import {
  IonContent,
  IonPage,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonDatetime,
  IonButton,
} from "@ionic/react";
import XBHeader from "../util/XBHeader";

import { addControllersProp } from "../util_model/controllers";

const Leaderboard = function (props) {
  const [date1, setDate1] = React.useState(new Date().toString());
  const [allTime, setAllTime] = React.useState(false);
  const [teams, setTeams] = React.useState(null);
  const [errored, setErrored] = React.useState(false);

  const loadTeams = async function (dates) {
    let raw;
    try {
      raw = await props.controllers.client.calculateTeamStats({
        all: true,
        dates,
      });
    } catch (error) {
      setErrored(true);
      console.error(error);
    }

    console.log(raw);

    for (const team of raw) {
      let overallScore = 0;
      for (const entry of Object.values(team.stats)) {
        overallScore += entry.overallScore;
      }

      team.overallScore = Math.round(overallScore * 1000);
    }

    raw.sort((a, b) => b.overallScore - a.overallScore);

    setTeams(raw);
  };

  React.useEffect(() => {
    loadTeams(date1);
  }, []);

  const handleDateChange = function (e) {
    const val = e.detail.value;
    setDate1(val);
    setAllTime(false);
    loadTeams(val);
  };

  const handleShowAllTime = function () {
    const state = !allTime;
    setAllTime(state);
    loadTeams(state ? undefined : date1);
  };

  let content;

  if (!teams) {
    if (errored) {
      content = "Something went wrong";
    } else {
      content = <IonSpinner name="crescent" class="spin" />;
    }
  } else {
    if (teams.length === 0) {
      content = "There's nothing to show for the selected period";
    } else {
      content = teams.map((team) => (
        <IonCard key={team.id}>
          <IonCardHeader>
            <IonCardTitle>{team.name}</IonCardTitle>
            <IonCardSubtitle>
              {team.userCount} member{team.userCount > 1 ? "s" : ""}
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>{team.overallScore}</IonCardContent>
        </IonCard>
      ));
    }
  }

  return (
    <IonPage>
      <XBHeader title="Teams &amp; Leaderboard"></XBHeader>
      <IonContent fullscreen>
        <IonDatetime
          value={date1}
          color="light"
          onIonChange={handleDateChange}
        />
        <IonButton onClick={handleShowAllTime}>
          {allTime ? "Show current date" : "Show all time"}
        </IonButton>
        {content}
      </IonContent>
    </IonPage>
  );
};

export default addControllersProp(Leaderboard);
