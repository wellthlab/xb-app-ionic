import {
  IonContent,
  IonSpinner,
  IonText,
  IonGrid,
  IonLabel,
  IonCol,
  IonRow,
} from "@ionic/react";
import { connect } from "react-redux";
import { addControllersProp } from "../util_model/controllers";

import XBHeader from "../util/XBHeader";
import TodoTasks from "./components/Tasks";
import TotalTimer from "./components/TotalTimer";

/**
 * Main page for users to track and record their movements
 *
 */
function TaskPlaylist(props) {
  props.controllers.LOAD_TEAMS_IF_REQD();

  if (!props.teams.teams.bybox) {
    return <IonSpinner name="crescent" class="center-spin" />;
  }

  const team = props.teams.teams.bybox.move[0];

  if (!team.s22plan) {
    return (
      <IonText>You need to plan your week before you can add minutes.</IonText>
    );
  }

  // const day = team.experiment.day;
  const day = 0; // TODO: revert back to above

  const requiredTasks = team.experiment.tasks[day].required;
  const optionalTasks = team.experiment.tasks[day].optional;
  const totalMinutes = team.s22plan.target;

  console.log("TaskPlaylist: requiredTasks", requiredTasks);

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
    };
  },
  {
    pure: false,
  }
)(addControllersProp(TaskPlaylist));
