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
  useIonAlert,
  IonList,
} from "@ionic/react";
import {
  chevronBackCircleOutline,
  chevronForwardCircleOutline,
  calendarOutline,
  playOutline,
} from "ionicons/icons";
import parse from "html-react-parser";
import getTaskIcon from "./TaskIcons";

function PlaylistDescription({ module, stage: currentPlaylist }) {
  const numPlaylists = module.playlists.length;
  return (
    <>
      <IonGrid>
        {/* Playlist description */}
        <IonItem
          lines="none"
          className="ion-text-justify"
          style={{
            "--padding-bottom": "10px",
            "--padding-start": "10px",
            "--inner-padding-end": "10px",
          }}
        >
          <IonRow>
            <IonCol>
              <IonText className="ion-text-justify">
                {parse(module.info.desc)}
              </IonText>
            </IonCol>
          </IonRow>
        </IonItem>

        <IonItem
          lines="none"
          style={{
            "--padding-bottom": "0px",
            "--padding-start": "10px",
            "--inner-padding-end": "10px",
          }}
        >
          <IonLabel className="ion-text-center">
            <IonText style={{ fontSize: "1.2em" }}>
              You have tried {currentPlaylist + 1} of {numPlaylists} playlists
            </IonText>
          </IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonProgressBar value={(currentPlaylist + 1) / numPlaylists} />
        </IonItem>
      </IonGrid>
    </>
  );
}

function PlaylistTasks({
  playlists,
  teamId,
  moduleId,
  userProgressIdx,
  toggleModal,
}) {
  const [currentPlaylist, setCurrentStage] = useState(userProgressIdx);
  const [notImplementedAlert] = useIonAlert();
  const notImplementedClick = () => {
    notImplementedAlert("Going back in time isn't ready yet!", [
      { text: "Close" },
    ]);
  };

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

  const tasksDesc = playlists[currentPlaylist].desc;
  const tasksForPlaylist = playlists[currentPlaylist].tasks;
  const taskIonItems = tasksForPlaylist.map((task) => {
    return (
      <IonItem color="transparent" lines="none">
        <IonIcon icon={getTaskIcon(task.verb)} slot="start" />
        <IonLabel>
          <IonText className="ion-text-wrap">{task.desc}</IonText>
        </IonLabel>
      </IonItem>
    );
  });

  return (
    <>
      <IonItem
        lines="none"
        style={{
          "--padding-start": "0px",
          "--inner-padding-end": "0px",
          "--padding-top": "15px",
        }}
      >
        <IonGrid>
          {/* Buttons for switching playlist stage */}
          <IonRow>
            <IonCol>
              <IonItem
                lines="none"
                style={{
                  "--inner-padding-start": "0px",
                  "--padding-end": "0px",
                }}
              >
                <IonButton
                  slot="start"
                  size="regular"
                  onClick={prevStage}
                  disabled={currentPlaylist <= 0}
                >
                  <IonIcon icon={chevronBackCircleOutline} />
                </IonButton>
                <IonLabel className="ion-text-center">
                  <IonText style={{ fontSize: "1.2em" }}>{tasksDesc}</IonText>
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
          <IonItem
            lines="none"
            style={{ "--padding-start": "10px", "--padding-top": "15px" }}
          >
            <IonRow>
              <IonCol>
                <IonList>
                  <IonItemGroup>{taskIonItems}</IonItemGroup>
                </IonList>
              </IonCol>
            </IonRow>
          </IonItem>
        </IonGrid>
      </IonItem>

      {/* Play buttons */}
      <IonItem
        lines="none"
        style={{
          "--padding-top": "10px",
          "--padding-bottom": "0px",
          "--padding-start": "0px",
          "--inner-padding-end": "0px",
        }}
      >
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
                  currentPlaylist
                }
                onClick={toggleModal}
              >
                <IonIcon icon={playOutline} />
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                expand="block"
                size="large"
                shape="circle"
                onClick={notImplementedClick}
              >
                <IonIcon icon={calendarOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </>
  );
}

function PlaylistDetail({ team, modules, moduleId, currentStage, closeModal }) {
  const module = modules.find((m) => m._id === moduleId);
  return (
    <>
      <PlaylistDescription module={module} stage={currentStage} />
      <IonCard>
        {/* <IonCardContent> */}
        <PlaylistTasks
          userProgressIdx={currentStage}
          playlists={module.playlists}
          teamId={team._id}
          moduleId={module._id}
          toggleModal={closeModal}
        />
        {/* </IonCardContent> */}
      </IonCard>
    </>
  );
}

export default PlaylistDetail;
