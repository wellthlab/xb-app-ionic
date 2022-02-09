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
import DayTasks from "./components/DayTasks";

const RecordMovement = (props) => {
  useEffect(() => {
    props.controllers.LOAD_TEAMS();
  }, [props.controllers]);

  let content;

  if (!props.teams.teams.bybox) {
    content = <ion-spinnder name="crescent" class="spin" />;
  } else {
    const group = props.teams.teams.bybox["move"][0];

    content = (
      <>
        <DayTasks group={group} />
        <IonButton href="/movementTimer" expand="block">
          Start Exercises
        </IonButton>
      </>
    );
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
