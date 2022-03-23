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
  IonThumbnail,
} from "@ionic/react";
import {
  chevronBackCircleOutline,
  chevronForwardCircleOutline,
  calendarOutline,
  playOutline,
} from "ionicons/icons";
import parse from "html-react-parser";
import getTaskIcon from "./TaskIcons";

function PlaylistDescription({ module, stage }) {
  const numStages = module.playlists.length;
  return (
    <IonItem
      lines="none"
      className="ion-text-justify"
      style={{ "--padding-bottom": "10px" }}
    >
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonText>{parse(module.info.desc)}</IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonLabel className="ion-text-center ">
              <IonText>
                You are currently at <strong>STAGE</strong> {stage + 1} of{" "}
                {numStages}
              </IonText>
            </IonLabel>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonProgressBar value={(stage + 1) / numStages} />
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
}

function PlaylistTasks({ playlists, teamId, moduleId, stage, toggleModal }) {
  const [currentStage, setCurrentStage] = useState(stage);
  const [notImplementedAlert] = useIonAlert();
  const notImplementedClick = () => {
    notImplementedAlert("Going back in time isn't ready yet!", [
      { text: "Close" },
    ]);
  };

  // These functions are used to control the buttons which control the day to
  // show the playlist for
  function nextStage() {
    if (currentStage >= playlists.length - 1) return;
    setCurrentStage(currentStage + 1);
  }
  function prevStage() {
    if (currentStage <= 0) return;
    setCurrentStage(currentStage - 1);
  }

  const tasksForStage = playlists[currentStage].tasks;
  const taskItems = tasksForStage.map((task) => {
    return (
      <IonItem lines="none">
        <IonIcon icon={getTaskIcon(task.verb)} slot="start" />
        <IonLabel>{task.desc}</IonLabel>
      </IonItem>
    );
  });

  return (
    <>
      <IonItem lines="none" style={{ "--padding-top": "15px" }}>
        <IonGrid>
          {/* Buttons for switching playlist stage */}
          <IonRow>
            <IonCol>
              <div className="ion-text-center">
                <IonButton
                  onClick={prevStage}
                  size="default"
                  disabled={currentStage <= 0}
                >
                  <IonIcon icon={chevronBackCircleOutline} />
                </IonButton>
              </div>
            </IonCol>
            <IonCol>
              <div className="ion-text-center">
                <IonText>
                  <h4>Stage {currentStage + 1}</h4>
                </IonText>
              </div>
            </IonCol>
            <IonCol>
              <div className="ion-text-center">
                <IonButton
                  onClick={nextStage}
                  size="default"
                  disabled={currentStage >= playlists.length - 1}
                >
                  <IonIcon icon={chevronForwardCircleOutline} />
                </IonButton>
              </div>
            </IonCol>
          </IonRow>

          {/* Tasks for the day's playlist */}
          <IonRow>
            <IonCol>
              <IonList>
                <IonItemGroup>{taskItems}</IonItemGroup>
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>

      {/* Play buttons */}
      <IonItem
        lines="none"
        style={{ "--padding-top": "10px", "--padding-bottom": "0px" }}
      >
        <IonGrid>
          <IonRow>
            <IonCol>
              <div class="ion-text-center">
                <IonButton
                  size="large"
                  shape="circle"
                  onClick={notImplementedClick}
                >
                  <IonIcon icon={calendarOutline} />
                </IonButton>

                <IonButton
                  size="large"
                  shape="circle"
                  color="success"
                  routerLink={
                    "/move/timer/" +
                    teamId +
                    "/" +
                    moduleId +
                    "/" +
                    currentStage
                  }
                  onClick={toggleModal}
                >
                  <IonIcon icon={playOutline} />
                </IonButton>
              </div>
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
          stage={currentStage}
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
