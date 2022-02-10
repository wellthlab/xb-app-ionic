import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonButton } from "@ionic/react";
import { connect } from "react-redux";
import { addControllersProp } from "../util_model/controllers";

import "./RecordMovement.scss";
import XBHeader from "../util/XBHeader";
import DayTasks from "./components/DayTasks";
import MovementTimer from "./MovementTimer";

/**
 * Main page for users to track and record their movements
 *
 */
function RecordMovement(props) {
  const [recordingMovement, setRecordingMovement] = useState(false);
  useEffect(() => {
    props.controllers.LOAD_TEAMS();
  }, [props.controllers]);

  let content;

  if (!props.teams.teams.bybox) {
    return <ion-spinnder name="crescent" class="spin" />;
  }

  const team = props.teams.teams.bybox["move"][0]; // TODO: this might need updating

  if (recordingMovement === false) {
    content = (
      <>
        <DayTasks team={team} />
        <IonButton onClick={() => setRecordingMovement(true)} expand="block">
          Start Exercises
        </IonButton>
      </>
    );
  } else {
    content = (
      <>
        <MovementTimer team={team} />
      </>
    );
  }

  return (
    <>
      <XBHeader title="Record Movement"></XBHeader>
      <IonContent fullscreen>{content}</IonContent>
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
