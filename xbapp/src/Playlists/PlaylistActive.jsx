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
import XBHeader from "../util/XBHeader";
import { checkboxOutline, playOutline, refreshOutline } from "ionicons/icons";
import { connect } from "react-redux";
import { addControllersProp } from "../util_model/controllers";
import { getActiveModules } from "./components/util";
import XBInfo from "../util/XBInfo";

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function PlaylistActive(props) {
  props.controllers.LOAD_TEAMS_IF_REQD();
  props.controllers.SET_USER_PROFILE_IF_REQD();
  props.controllers.LOAD_MODULES_IF_REQD();

  if (
    !props.teams.loaded ||
    !props.userProfile.loaded ||
    !props.modules.loaded
  ) {
    return (
      <IonPage>
        <XBHeader title="Your Playlists" />
        <IonContent>
          <IonSpinner className="center-spin" name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  const team = props.teams.teams.bybox["move"][0];
  const expDay = team.experiment.day;
  const userProfile = props.userProfile.userProfile;
  const availableModules = props.modules.modules;

  const userModules = userProfile.modules || {};
  const activeModules = getActiveModules(userModules);

  let activePlaylists = activeModules.map((userModuleObj) => {
    const module = availableModules.find((m) => m._id === userModuleObj.id);
    const moduleColour = module.info.colour;
    const currentPlaylist =
      userModuleObj.stage >= module.playlists.length
        ? module.playlists.length - 1
        : userModuleObj.stage;

    const completedMsg = "Completed, feel free to replay!";
    const playlistMinutes =
      userModuleObj.stage >= module.playlists.length
        ? completedMsg
        : parseInt(module.playlists[currentPlaylist].minutes, 10) || 0;

    const expDayIdx = expDay === 0 ? 0 : expDay - 1;
    const moduleDoneToday =
      userModuleObj.id in team.entries[expDayIdx].completedModules;
    const doneIcon =
      playlistMinutes === completedMsg ? refreshOutline : checkboxOutline;

    return (
      <IonCard>
        <IonItem
          lines="none"
          style={{ "--ion-item-background": moduleColour }}
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
                  currentPlaylist
                }
                onClick={() => {
                  // store the active-playlist, so we can go back to the last
                  // playlist when switching between playing and picking
                  // in the detailed view.
                  // not ideal, but avoids reloading the state (with the redux
                  // store) or polluting router history by updating the URL
                  localStorage.setItem("active-playlist", currentPlaylist);
                }}
              >
                <IonLabel>
                  <IonRow>
                    <strong>{module.name}</strong>
                  </IonRow>
                  <IonRow>
                    <IonText color={"medium"}>
                      Playlist {currentPlaylist + 1} of{" "}
                      {module.playlists.length}
                    </IonText>
                  </IonRow>
                  <IonRow>
                    <IonText color={"medium"}>
                      {playlistMinutes} minutes
                    </IonText>
                  </IonRow>
                </IonLabel>
                <IonLabel slot="end">
                  {moduleDoneToday || playlistMinutes === completedMsg ? (
                    <IonIcon size="large" icon={doneIcon} />
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
      <XBHeader title={"Your Playlists"} />
      <IonContent>
        <XBInfo
          title={"CONTINUE PLAYING"}
          desc={
            "Here are all of the playlists that you have started playing. You can continue where you left off, " +
            "by clicking on the playlist you want to continue."
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
)(addControllersProp(PlaylistActive));
