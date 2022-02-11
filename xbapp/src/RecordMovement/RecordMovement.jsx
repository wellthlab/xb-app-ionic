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
  // let [currentTask, setCurrentTask] = useState(null);
  useEffect(() => {
    props.controllers.LOAD_TEAMS();
  }, [props.controllers]);

  if (!props.teams.teams.bybox) {
    return <IonSpinner name="crescent" class="spin" />;
  }

  let team = props.teams.teams[0]; // TODO: is the right way to get the team?
  let day = team.experiment.day;
  let requiredTasks = team.experiment.tasks[day].required;

  // Get the tasks which are timed and sum the total minutes expected
  let totalMinutes = 0;
  const timedTasks = [];
  for (let i in requiredTasks) {
    if (typeof requiredTasks[i].timed !== "undefined") {
      if (requiredTasks[i].timed) {
        timedTasks.push(requiredTasks[i]);
        totalMinutes += requiredTasks[i].mins;
      }
    }
  }

  // TODO: hack to pass the total expected minutes :)
  localStorage.setItem("totalMinutes", totalMinutes);

  return (
    <>
      <XBHeader title="Record Movement"></XBHeader>
      <IonContent fullscreen>
        {" "}
        <TodoTasks
          day={day}
          team={team}
          tasks={timedTasks}
          minutes={totalMinutes}
        />
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
