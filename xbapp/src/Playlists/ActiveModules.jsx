import {
  IonPage,
  IonContent,
  IonCard,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonText,
  IonIcon,
  IonSpinner,
} from "@ionic/react";
import { checkboxOutline, playOutline, refreshOutline } from "ionicons/icons";
import { connect } from "react-redux";

import { addControllersProp } from "../util_model/controllers";
import { getActiveModules } from "./components/util";
import XBHeader from "../util/XBHeader";
import XBInfo from "../util/XBInfo";

/**
 * Present a list of active playlists for a user, which can be pressed to
 * continue where they left off. This component is meant to act as a shortcut
 * to getting to the playlists people have been working on.
 *
 * @param teams
 * @param userProfile
 * @param modules
 * @param controllers
 *
 * @returns {JSX.Element}
 */
function ActiveModules({ teams, userProfile, modules, controllers }) {
  controllers.LOAD_TEAMS_IF_REQD();
  controllers.SET_USER_PROFILE_IF_REQD();
  controllers.LOAD_MODULES_IF_REQD();

  if (!teams.loaded || !userProfile.loaded || !modules.loaded) {
    return (
      <IonPage>
        <XBHeader title="Your Playlists" />
        <IonContent>
          <IonSpinner className="center-spin" name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  const team = teams.teams.bybox["move"][0];
  const expDay = team.experiment.day;
  const expDayIdx = expDay === 0 ? 0 : expDay - 1;

  const profile = userProfile.userProfile;
  const availableModules = modules.modules;
  const userModules = profile.modules || {};

  const activeModules = getActiveModules(userModules);

  let activePlaylists = activeModules.map((userModule) => {
    if (userModule.active === false) {
      return null;
    }

    const completedModuleMessage = "Completed, feel free to replay!";
    const module = availableModules.find((m) => m._id === userModule.id);
    const colour = module.info.colour;

    const userProgression =
      userModule.stage >= module.playlists.length
        ? module.playlists.length - 1
        : userModule.stage;

    const currentPlaylistMinutes =
      userModule.stage >= module.playlists.length
        ? completedModuleMessage
        : parseInt(module.playlists[userProgression].minutes, 10) || 0;

    const playedModuleToday =
      userModule.id in team.entries[expDayIdx].completedModules;

    // A module is considered played when the user has played it today, or when
    // they have completed all playlists. In the latter case, display a replay
    // icon to indicate it can be replayed if they want.
    const playedModuleIcon =
      currentPlaylistMinutes === completedModuleMessage
        ? refreshOutline
        : checkboxOutline;

    return (
      <IonCard>
        <IonItem
          lines="none"
          style={{ "--ion-item-background": colour }}
          key={module._id}
        />
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem
                button
                lines="none"
                key={module.id}
                detail={false}
                routerLink={
                  "/move/task-detail/play/" +
                  team._id +
                  "/" +
                  module._id +
                  "/" +
                  userProgression
                }
                onClick={() => {
                  // store the active-playlist, so we can go back to the last
                  // playlist when switching between playing and picking
                  // in the detailed view.
                  // not ideal, but avoids reloading the state (with the redux
                  // store) or polluting router history by updating the URL
                  localStorage.setItem("active-playlist", userProgression);
                }}
              >
                <IonLabel>
                  <IonRow>
                    <strong>{module.name}</strong>
                  </IonRow>
                  <IonRow>
                    <IonText color={"medium"}>
                      Playlist {userProgression + 1} of{" "}
                      {module.playlists.length}
                    </IonText>
                  </IonRow>
                  <IonRow>
                    <IonText color={"medium"}>
                      {currentPlaylistMinutes} minutes
                    </IonText>
                  </IonRow>
                </IonLabel>
                <IonLabel slot="end">
                  {playedModuleToday ||
                  currentPlaylistMinutes === completedModuleMessage ? (
                    <IonIcon size="large" icon={playedModuleIcon} />
                  ) : (
                    <IonIcon size="large" icon={playOutline} />
                  )}
                </IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCard>
    );
  });

  return (
    <IonPage>
      <XBHeader title={"Move"} />
      <IonContent>
        <XBInfo
          title={"CONTINUE PLAYING"}
          desc={
            "These are the playlists that you have started. Continue where " +
            "you left off, by clicking the one you want to continue playing."
          }
        />
        {activePlaylists}
      </IonContent>
    </IonPage>
  );
}

export default connect(
  (state, ownProps) => {
    return {
      teams: state.teams,
      modules: state.modules,
      userProfile: state.userProfile,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(ActiveModules));
