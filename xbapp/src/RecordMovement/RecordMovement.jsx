import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonButton } from "@ionic/react";
import { connect } from "react-redux";
import { addControllersProp } from "../util_model/controllers";

import "./RecordMovement.scss";
import XBHeader from "../util/XBHeader";
import DayTasks from "./components/DayTasks";

/**
 * Main page for users to track and record their movements
 *
 */
function RecordMovement(props) {
  useEffect(() => {
    props.controllers.LOAD_TEAMS();
  }, [props.controllers]);

  let content;

  if (!props.teams.teams.bybox) {
    return <ion-spinnder name="crescent" class="spin" />;
  } else {
    const group = props.teams.teams.bybox["move"][0]; // TODO: this might need updating

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
    <>
      <IonContent fullscreen>
        <XBHeader title="Record Movement"></XBHeader>
        {content}
      </IonContent>
    </>
  );
}

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
