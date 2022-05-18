import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonRow,
  IonText,
  IonCard,
} from "@ionic/react";
import {
  calendarOutline,
  chevronBackOutline,
  chevronForwardOutline,
  playOutline,
  refreshOutline,
  arrowBackOutline,
} from "ionicons/icons";
import getTaskIcon from "../player/taskIcons";
import { preparePlaylist } from "../util";

/**
 *
 * @param module
 * @param teamId
 * @param isPlaying
 * @param userProgressIdx
 * @param currentPlaylistIdx
 * @param setCurrentStage
 * @returns {JSX.Element}
 * @constructor
 */
function PlaylistTaskCard({
  module,
  teamId,
  isPlaying,
  userProgressIdx,
  currentPlaylistIdx,
  setCurrentPlaylistIdx,
  toggleListView,
}) {
  const playlistName = module.playlists[currentPlaylistIdx].desc;
  const playlistTime =
    parseInt(module.playlists[currentPlaylistIdx].minutes, 10) || 0;
  const tasks = preparePlaylist(module.playlists[currentPlaylistIdx].tasks);
  const atLatestPlaylist = currentPlaylistIdx === userProgressIdx;
  const isSnack = module.topic.includes("snack/");
  const numPlaylists = module.playlists.length;

  // store the active-playlist, so we can go back to the last
  // playlist when switching between playing and picking
  // in the detailed view.
  // not ideal, but avoids reloading the state (with the redux
  // store) or polluting router history by updating the URL
  function setActivePlaylist(index) {
    localStorage.setItem("active-playlist", index);
  }

  // These functions are used to control the buttons which control the day to
  // show the playlist for
  function nextStage() {
    if (currentPlaylistIdx >= module.playlists.length - 1) return;
    setActivePlaylist(currentPlaylistIdx + 1);
    setCurrentPlaylistIdx(currentPlaylistIdx + 1);
  }
  function prevStage() {
    if (currentPlaylistIdx <= 0) return;
    setActivePlaylist(currentPlaylistIdx - 1);
    setCurrentPlaylistIdx(currentPlaylistIdx - 1);
  }

  const taskItems = tasks.map((task, taskIndex) => {
    return (
      <IonItem
        button={isPlaying}
        lines="none"
        key={taskIndex}
        detail={isPlaying}
        routerLink={
          isPlaying
            ? "/move/timer/play/" +
              teamId +
              "/" +
              module._id +
              "/" +
              currentPlaylistIdx +
              "/" +
              userProgressIdx +
              "/" +
              taskIndex
            : undefined
        }
      >
        <IonIcon icon={getTaskIcon(task.verb)} slot="start" />
        <IonLabel>
          {isPlaying ? (
            <IonText className="ion-text-wrap">
              <u>{task.desc}</u>
            </IonText>
          ) : (
            <IonText className="ion-text-wrap">{task.desc}</IonText>
          )}
        </IonLabel>
      </IonItem>
    );
  });

  const week = Math.floor(currentPlaylistIdx / 5) + 1;
  const day = currentPlaylistIdx + 1 - (week - 1) * 5;

  return (
    <IonCard>
      <IonItem lines="none" className="playlist-navigate-button-item">
        <IonGrid>
          {/* Buttons for switching playlist stage */}
          <IonRow>
            <IonCol>
              {/* in an item to make use of the slot property */}
              <IonItem lines="none" className="button-padding">
                {/* previous button */}
                {numPlaylists > 1 ? (
                  <IonButton
                    slot="start"
                    size="regular"
                    onClick={prevStage}
                    disabled={currentPlaylistIdx <= 0}
                  >
                    <IonIcon icon={chevronBackOutline} />
                  </IonButton>
                ) : (
                  ""
                )}

                {/* current playlist name */}
                <IonLabel className="ion-text-center ion-text-wrap">
                  <IonText className="ion-text-big ion-text-wrap">
                    {isSnack ? (
                      <strong>{playlistName}</strong>
                    ) : (
                      <div>
                        <strong>
                          Week {Math.ceil(week)} Day {day}
                        </strong>
                        <br />
                        {playlistName}
                      </div>
                    )}
                  </IonText>
                </IonLabel>

                {/* next button */}
                {numPlaylists > 1 ? (
                  <IonButton
                    slot="end"
                    size="regular"
                    onClick={nextStage}
                    disabled={
                      currentPlaylistIdx >= userProgressIdx ||
                      currentPlaylistIdx >= module.playlists.length - 1
                    }
                  >
                    <IonIcon icon={chevronForwardOutline} />
                  </IonButton>
                ) : (
                  ""
                )}
              </IonItem>
            </IonCol>
          </IonRow>

          {/* display tasks for the current playlist */}
          <IonItem lines="none" className="task-padding">
            <IonCol>
              <IonList>
                <IonItemGroup>{taskItems}</IonItemGroup>
              </IonList>
            </IonCol>
          </IonItem>
        </IonGrid>
      </IonItem>

      {/* Play buttons, do not show if in explore mode */}

      <IonItem lines="none" className="play-buttons-padding">
        <IonGrid>
          {isPlaying ? (
            <div>
              {/* playlist length in minutes */}
              <IonRow>
                <IonCol className="ion-text-center">
                  <IonText>
                    {playlistTime > 0 ? (
                      <>
                        This playlist will take a maximum of {playlistTime}{" "}
                        minutes to finish
                      </>
                    ) : (
                      ""
                    )}
                  </IonText>
                </IonCol>
              </IonRow>

              {/* instructions */}
              <IonRow>
                <IonCol
                  className="ion-text-center"
                  style={{ fontSize: "0.88em" }}
                >
                  <IonText>
                    Press {atLatestPlaylist ? "play" : "replay"} to start, or
                    click a task to {atLatestPlaylist ? "start" : "replay"} from
                  </IonText>
                </IonCol>
              </IonRow>

              {/* play and history buttons */}
              <IonRow>
                <IonCol>
                  {/* play or replay */}
                  <IonButton
                    expand="block"
                    size="regular"
                    color="success"
                    routerLink={
                      "/move/timer/play/" +
                      teamId +
                      "/" +
                      module._id +
                      "/" +
                      currentPlaylistIdx +
                      "/" +
                      userProgressIdx +
                      "/0" // start on first task when green button pressed
                    }
                  >
                    <IonIcon
                      icon={atLatestPlaylist ? playOutline : refreshOutline}
                      slot="start"
                    />
                    <IonLabel>{atLatestPlaylist ? "Play" : "Replay"}</IonLabel>
                  </IonButton>
                </IonCol>
                {isSnack ? (
                  ""
                ) : (
                  <IonCol>
                    {/* historic entry */}
                    <IonButton
                      expand="block"
                      size="regular"
                      routerLink={
                        "/move/task-player-historic/" +
                        teamId +
                        "/" +
                        module._id +
                        "/" +
                        currentPlaylistIdx +
                        "/" +
                        userProgressIdx
                      }
                    >
                      <IonIcon icon={calendarOutline} slot="start" />
                      <IonLabel>Past</IonLabel>
                    </IonButton>
                  </IonCol>
                )}
              </IonRow>
            </div>
          ) : (
            <IonButton
              expand="block"
              size="regular"
              shape="circle"
              onClick={() => {
                toggleListView(localStorage.getItem("active-playlist"));
              }}
            >
              <IonIcon icon={arrowBackOutline} slot={"start"} />
              Back
            </IonButton>
          )}
        </IonGrid>
      </IonItem>
    </IonCard>
  );
}

export default PlaylistTaskCard;
