import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonTitle,
  IonDatetime,
  IonHeader,
  IonButton,
} from "@ionic/react";

import "./RecordMovement.scss";
import XBHeader from "../util/XBHeader";
import { connect } from "react-redux";
import { addControllersProp } from "../util_model/controllers";
import DailyActions from "../Boxes/components/DailyActions";

const RecordMovement = (props) => {
  const [activeDay, setActiveDay] = useState(new Date());
  useEffect(() => {
    props.controllers.LOAD_TEAMS();
  }, [!!props.teams]);

  let content;

  if (!props.teams.teams.bybox) {
    content = <ion-spinnder name="crescent" class="spin" />;
  } else {
    const group = props.teams.teams.bybox["move"][0];
    const day = group.experiment.day;
    const tasks = group.experiment.tasks[day].required;

    if (!tasks) {
      content = (
        <>
          <IonTitle>You have no tasks!</IonTitle>
        </>
      );
    } else {
      console.log(group.entries);
      content = (
        <>
          <DailyActions group={group} today={day} />
          <IonButton href="/timer" expand="block">
            Start
          </IonButton>
        </>
      );
    }
  }

  return (
    <IonPage>
      <XBHeader title="Record Movement"></XBHeader>
      <IonContent fullscreen>{content}</IonContent>
    </IonPage>
  );
};

export default connect(
  (state, ownProps) => {
    return {
      teams: state.teams,
      experiments: state.experiments,
    };
  },
  {
    // Actions to include as props
  }
)(addControllersProp(RecordMovement));
