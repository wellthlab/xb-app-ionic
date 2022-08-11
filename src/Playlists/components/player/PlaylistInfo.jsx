import {
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonGrid,
  IonText,
} from "@ionic/react";

import "../../css/PlaylistPlayer.css";
import PlaylistTaskAccordion from "./PlaylistTaskAccordion";

/**
 * Displays some useful information about the current playlist, and allows the
 * user to switch between tasks using an accordion style dropdown menu
 */
function PlaylistInfo({
  module,
  currentPlaylist,
  tasks = undefined,
  currentTaskIdx = undefined,
  setCurrentTask = undefined,
  isSnack = false,
}) {
  return (
    <>
      <IonItem lines="none">
        <IonGrid>
          <IonRow>
            <IonItem lines="none">
              <IonLabel>
                <IonText className="ion-text-wrap ion-text-center ion-text-header">
                  {module.playlists[currentPlaylist].desc}
                </IonText>
                <IonText className="ion-text-wrap">
                  {isSnack ? (
                    ""
                  ) : (
                    <>
                      <br />
                      Playlist {currentPlaylist + 1} of{" "}
                      {module.playlists.length}
                    </>
                  )}
                  <br />
                  {module.playlists[currentPlaylist].minutes ? (
                    <>{module.playlists[currentPlaylist].minutes} mins</>
                  ) : (
                    ""
                  )}
                </IonText>
              </IonLabel>
            </IonItem>
          </IonRow>
          {tasks ? (
            <IonRow>
              <IonCol>
                <PlaylistTaskAccordion
                  tasks={tasks}
                  currentTaskIdx={currentTaskIdx}
                  setCurrentTask={setCurrentTask}
                />
              </IonCol>
            </IonRow>
          ) : (
            ""
          )}
        </IonGrid>
      </IonItem>
    </>
  );
}

export default PlaylistInfo;
