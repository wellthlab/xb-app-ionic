import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonSpinner,
  IonButton,
  IonText,
  IonGrid,
  IonLabel,
  IonCol,
  IonRow,
} from "@ionic/react";
import { connect } from "react-redux";
import { addControllersProp } from "../util_model/controllers";

// import "./RecordMovement.scss";
import XBHeader from "../util/XBHeader";
import TodoTasks from "./components/Tasks";
import TotalTimer from "./components/TotalTimer";

/**
 * Main page for users to track and record their movements
 *
 */
function RecordMovement(props) {
  props.controllers.LOAD_TEAMS_IF_REQD();

  if (!props.teams.teams.bybox) {
    return <IonSpinner name="crescent" class="center-spin" />;
  }

  let team = props.teams.teams.bybox.move[0];
  console.log("Timer using team", team);

  if (!team.s22plan) {
    return (
      <IonText>You need to plan your week before you can add minutes.</IonText>
    );
  }

  let day = team.experiment.day;
  let requiredTasks = team.experiment.tasks[day].required;
  let optionalTasks = team.experiment.tasks[day].optional;
  let totalMinutes = team.s22plan.target;

  return (
    <>
      <XBHeader title="Record Movement"></XBHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol>
              <TodoTasks
                day={day}
                team={team}
                tasks={requiredTasks}
                optional={optionalTasks}
                minutes={totalMinutes}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol style={{ marginTop: "30px" }}>
              <IonLabel>Your Progress Today</IonLabel>
              <TotalTimer
                target={team.myTargetToday}
                logged={team.myMinutesToday}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
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
