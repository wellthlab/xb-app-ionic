import React, { useState, useEffect } from "react";
import { IonContent, IonSpinner, IonButton } from "@ionic/react";
import { connect } from "react-redux";
import { addControllersProp } from "../util_model/controllers";

// import "./RecordMovement.scss";
import XBHeader from "../util/XBHeader";
import DayTasks from "./components/Tasks";
import MovementTimer from "./MovementTimer";

/**
 * Main page for users to track and record their movements
 *
 */
function RecordMovement(props) {
  let [recordingMovement, setRecordingMovement] = useState(false);
  useEffect(() => {
    props.controllers.LOAD_TEAMS();
  }, [props.controllers]);

  let content;

  if (!props.teams.teams.bybox) {
    return <IonSpinner name="crescent" class="spin" />;
  }

  let team = props.teams.teams.bybox["move"][0]; // TODO: this might need updating?
  let missing = team.entries[0].missing;

  if (recordingMovement === false) {
    content = (
      <>
        <DayTasks day={team.experiment.day} team={team} />
        <IonButton
          onClick={() => setRecordingMovement(true)}
          expand="block"
          disabled={missing}
        >
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
