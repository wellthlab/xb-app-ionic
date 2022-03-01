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
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
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
function TaskPlaylist(props) {
  props.controllers.LOAD_TEAMS_IF_REQD();
  props.controllers.LOAD_MODULES_IF_REQD();

  if (!props.teams.teams.bybox || !props.modules.modules) {
    return <IonSpinner name="crescent" class="center-spin" />;
  }

  let team = props.teams.teams.bybox.move[0];
  let modules = props.modules.modules;

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
      <XBHeader title="Your Playlist"></XBHeader>
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
      account: state.account,
      teams: state.teams,
      experiments: state.experiments,
      modules: state.modules,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(TaskPlaylist));
