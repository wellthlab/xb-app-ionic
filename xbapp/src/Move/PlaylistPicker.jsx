import {
  IonContent,
  IonSpinner,
  IonGrid,
  IonLabel,
  IonCol,
  IonRow,
  IonItem,
  IonPage,
  IonList,
  IonButton,
  IonIcon,
  IonItemGroup,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import { warningOutline, playOutline } from "ionicons/icons";

import { connect } from "react-redux";
import { addControllersProp } from "../util_model/controllers";

import XBHeader from "../util/XBHeader";

/**
 * Main page for users to track and record their movements
 *
 */
function PlaylistPicker(props) {
  props.controllers.LOAD_TEAMS_IF_REQD();
  props.controllers.SET_USER_PROFILE_IF_REQD();
  props.controllers.LOAD_MODULES_IF_REQD();

  if (!props.teams.teams.bybox) {
    return <IonSpinner class="center-spin" name="crescent" />;
  }

  if (!props.userProfile.userProfile) {
    return <IonSpinner class="center-spin" name="crescent" />;
  }

  if (!props.modules.modules) {
    return <IonSpinner class="center-spin" name="crescent" />;
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

  function ActiveModulePlaylist() {
    let subscribedModules = props.userProfile.userProfile.modules;

    const activeModuleIds = [];
    for (const [topic, moduleIds] of Object.entries(subscribedModules)) {
      activeModuleIds.push(...moduleIds);
    }

    let activePlaylists = activeModuleIds.map((id) => {
      let module = props.modules.modules.find((m) => m._id === id);
      return (
        <>
          <IonItem
            button
            key={module.id}
            detail={true}
            detailIcon={playOutline}
            routerLink={"/move/task-player/" + module.topic + "/" + module._id}
          >
            <IonLabel>{module.name}</IonLabel>
          </IonItem>
        </>
      );
    });

    return (
      <>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Your Active Plans</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  {activePlaylists.length > 0 ? (
                    <IonList>
                      <IonItemGroup>{activePlaylists}</IonItemGroup>
                    </IonList>
                  ) : (
                    <IonGrid>
                      <IonRow>
                        <IonCol>
                          <IonItem lines="none">
                            <IonIcon icon={warningOutline} slot="start" />
                            <div>You have no active playlists</div>
                          </IonItem>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  )}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <IonRow>
              <IonCol>
                <IonButton expand="full" routerLink="/subscribe/modules">
                  Manage Plans
                </IonButton>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
      </>
    );
  }

  return (
    <>
      <IonPage>
        <XBHeader title="Movement Playlists"></XBHeader>
        <IonContent>
          <ActiveModulePlaylist />
        </IonContent>
      </IonPage>
    </>
  );
}

export default connect(
  (state, ownProps) => {
    return {
      modules: state.modules,
      userProfile: state.userProfile,
      teams: state.teams,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(PlaylistPicker));

{
  /* <IonGrid>
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
</IonGrid> */
}
