import React, { useState, useEffect } from "react";
import { IonContent, IonSpinner, IonButton } from "@ionic/react";
import { connect } from "react-redux";
import { addControllersProp } from "../util_model/controllers";

// import "./RecordMovement.scss";
import XBHeader from "../util/XBHeader";
import TodoTasks from "./components/Tasks";
import MovementTimer from "./MovementTimer";

/**
 * Main page for users to track and record their movements
 *
 */
function RecordMovement(props) {
  let [recordingMovement, setRecordingMovement] = useState(false);
  let [currentTask, setCurrentTask] = useState(null);
  useEffect(() => {
    props.controllers.LOAD_TEAMS();
  }, [props.controllers]);

  let content;

  if (!props.teams.teams.bybox) {
    return <IonSpinner name="crescent" class="spin" />;
  }

  let team = props.teams.teams[0]; // TODO: this might need updating?
  let day = team.experiment.day;
  let tasks = team.experiment.tasks[day].required;

  let task = tasks[0];

  if (recordingMovement === false) {
    content = (
      <>
        <TodoTasks day={day} team={team} />
        <IonButton
          onClick={() => setRecordingMovement(true)}
          expand="block"
          disabled={!(tasks.length > 0)}
        >
          START
        </IonButton>
      </>
    );
  } else {
    content = (
      <>
        <MovementTimer team={team} task={task} />
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
