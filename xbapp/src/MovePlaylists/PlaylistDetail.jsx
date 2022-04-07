import { useState } from "react";
import {
  IonItem,
  IonItemGroup,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonLabel,
  IonProgressBar,
  IonText,
  IonCard,
  IonList,
  IonPage,
  IonContent,
  IonSpinner,
} from "@ionic/react";
import { connect } from "react-redux";
import {
  chevronBackCircleOutline,
  chevronForwardCircleOutline,
  calendarOutline,
  playOutline,
} from "ionicons/icons";
import parse from "html-react-parser";
import getTaskIcon from "./components/taskIcons";

import "./PlaylistDetail.css";
import XBHeader from "../util/XBHeader";
import { addControllersProp } from "../util_model/controllers";

/**
 * Renders information for the module, as well as a list of tasks for the
 *  current playlist, as defined by the currentPlaylist variable.
 *
 * @param team
 * @param modules
 * @param moduleId
 * @param currentPlaylistIdx
 * @param closeModal
 */
function PlaylistDetail({ teams, modules, userProfile, controllers, match }) {
  const teamId = match.params.teamId;
  const moduleId = match.params.moduleId;
  // const playlist = parseInt(match.params.playlist, 10);
  const progress = parseInt(match.params.progress, 10);

  const [userProgressIdx, _] = useState(progress); // don't need to set this, but am storing it as a state variable
  const [currentPlaylist, setCurrentStage] = useState(progress);

  controllers.LOAD_MODULES_IF_REQD();
  controllers.SET_USER_PROFILE_IF_REQD();

  if (!modules.loaded || !userProfile.loaded) {
    return <IonSpinner name="crescent" className="center-spin" />;
  }

  const module = modules.modules.find((m) => m._id === moduleId);
  const playlists = module.playlists;

  // These functions are used to control the buttons which control the day to
  // show the playlist for
  function nextStage() {
    if (currentPlaylist >= playlists.length - 1) return;
    setCurrentStage(currentPlaylist + 1);
  }
  function prevStage() {
    if (currentPlaylist <= 0) return;
    setCurrentStage(currentPlaylist - 1);
  }

  const playlistName = playlists[currentPlaylist].desc;
  const playlistTime = parseInt(playlists[currentPlaylist].minutes, 10) || 0;
  const tasksForPlaylist = playlists[currentPlaylist].tasks;
  const taskIonItems = tasksForPlaylist.map((task, index) => {
    return (
      <IonItem color="transparent" lines="none" key={index}>
        <IonIcon icon={getTaskIcon(task.verb)} slot="start" />
        <IonLabel>
          <IonText className="ion-text-wrap">{task.desc}</IonText>
        </IonLabel>
      </IonItem>
    );
  });

  const playlistTasks = (
    <>
      <IonItem lines="none" className="playlist-navigate-button-item">
        <IonGrid>
          {/* Buttons for switching playlist stage */}
          <IonRow>
            <IonCol>
              <IonItem lines="none" className="button-padding">
                <IonButton
                  slot="start"
                  size="regular"
                  onClick={prevStage}
                  disabled={currentPlaylist <= 0}
                >
                  <IonIcon icon={chevronBackCircleOutline} />
                </IonButton>
                <IonLabel className="ion-text-center">
                  <IonText className="ion-text-big">
                    {currentPlaylist + 1}.&nbsp;&nbsp;&nbsp;&nbsp;{playlistName}
                  </IonText>
                </IonLabel>
                <IonButton
                  slot="end"
                  size="regular"
                  onClick={nextStage}
                  disabled={
                    currentPlaylist >= userProgressIdx ||
                    currentPlaylist >= playlists.length - 1
                  }
                >
                  <IonIcon icon={chevronForwardCircleOutline} />
                </IonButton>
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Tasks for the day's playlist */}
          <IonItem lines="none" className="task-padding">
            <IonGrid>
              <IonRow>
                <IonCol className="ion-text-center ion-text-big">
                  <IonText>
                    {playlistTime > 0 ? (
                      <>This playlist will take you {playlistTime} minutes</>
                    ) : (
                      ""
                    )}
                  </IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonList>
                    <IonItemGroup>{taskIonItems}</IonItemGroup>
                  </IonList>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
        </IonGrid>
      </IonItem>

      {/* Play buttons */}
      <IonItem lines="none" className="play-buttons-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton
                expand="block"
                size="large"
                shape="circle"
                color="success"
                routerLink={
                  "/move/timer/" +
                  teamId +
                  "/" +
                  moduleId +
                  "/" +
                  currentPlaylist +
                  "/" +
                  userProgressIdx
                }
                // onClick={closeModal}
              >
                <IonIcon icon={playOutline} />
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                expand="block"
                size="large"
                shape="circle"
                routerLink={
                  "/move/task-player-historic/" +
                  teamId +
                  "/" +
                  moduleId +
                  "/" +
                  currentPlaylist +
                  "/" +
                  userProgressIdx
                }
              >
                <IonIcon icon={calendarOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </>
  );

  const moduleDescription = (
    <>
      <IonGrid>
        {/* Playlist description */}
        <IonItem lines="none" className="ion-text-header">
          {/* <IonRow>
            <IonCol> */}
          <IonLabel className="ion-text-center">
            <IonText>{module.name.toUpperCase()}</IonText>
          </IonLabel>
          {/* </IonCol>
          </IonRow> */}
        </IonItem>
        <IonItem lines="none" className="ion-text-justify playlist-description">
          <IonRow>
            <IonCol>
              <IonText className="ion-text-justify">
                {parse(module.info.desc)}
              </IonText>
            </IonCol>
          </IonRow>
        </IonItem>

        <IonItem lines="none" className="playlist-progress">
          <IonLabel className="ion-text-center">
            <IonText className="ion-text-big">
              {/* TODO: the 2nd branch should be unreachable until I figure out
              how best to keep track of finishing a module  */}
              {userProgressIdx + 1 < playlists.length + 1 ? (
                <>
                  You are on playlist {userProgressIdx + 1} of{" "}
                  {playlists.length}
                </>
              ) : (
                <>
                  You have <strong>completed</strong> this module!
                  <br />
                  Feel free to replay it!
                </>
              )}
            </IonText>
          </IonLabel>
        </IonItem>
        <IonItem lines="full">
          <IonProgressBar value={(userProgressIdx + 1) / playlists.length} />
        </IonItem>
      </IonGrid>
    </>
  );

  return (
    <IonPage>
      <XBHeader title={"Movement"} colour={module.info.colour} />
      <IonContent>
        {moduleDescription}
        <IonCard>{playlistTasks}</IonCard>
      </IonContent>
    </IonPage>
  );
}

export default connect((state, ownProps) => {
  return {
    modules: state.modules,
    userProfile: state.userProfile,
  };
}, {})(addControllersProp(PlaylistDetail));
