import {
  IonContent,
  IonSpinner,
  IonText,
  IonGrid,
  IonLabel,
  IonCol,
  IonRow,
  IonItem,
  IonPage,
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

  let team;
  try {
    team = props.teams.teams.bybox.move[0];
  } catch (e) {
    console.warn("Error whilst accessing team data", e);
    return (
      <IonContent>
        <div className="center-message">
          <h3>There has been an error.</h3>
          <h3>
            To take part in this experiment, you first need to join a team and
            set up your user profile from the progress page.
          </h3>
        </div>
      </IonContent>
    );
  }

  if (!team.s22plan) {
    return (
      <div className="center-message">
        <h3>
          You need to plan your week in the progress page before you can add
          minutes.
        </h3>
      </div>
    );
  }

  const day = team.experiment.day;

  const requiredTasks = team.experiment.tasks[day].required;
  const optionalTasks = team.experiment.tasks[day].optional;
  const totalMinutes = team.s22plan.target;

  return (
    <>
      <IonPage>
        <XBHeader title="Your Activity Playlist"></XBHeader>
        <IonContent>
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
              <IonCol>
                <p>
                  <IonLabel>Your Progress Today</IonLabel>
                </p>
                <TotalTimer
                  target={team.myTargetToday}
                  logged={team.myMinutesToday}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
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
