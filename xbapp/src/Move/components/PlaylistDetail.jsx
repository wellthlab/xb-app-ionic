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
  IonList,
} from "@ionic/react";
import {
  chevronBackCircleOutline,
  chevronForwardCircleOutline,
  calendarOutline,
  playOutline,
} from "ionicons/icons";

import { useState } from "react";

function PlaylistDescription({ module, stage }) {
  const numStages = module.tasks.length;
  return (
    <IonItem lines="none">
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonLabel>{module.desc}</IonLabel>
          </IonCol>
        </IonRow>
        <IonItem lines="none">
          <IonRow>
            <IonCol>
              <IonText>
                You are currently at <strong>STAGE</strong> {stage + 1} out of{" "}
                {numStages}
              </IonText>
            </IonCol>
          </IonRow>
        </IonItem>
        <IonRow>
          <IonCol>
            <IonProgressBar value={(stage + 1) / numStages} />
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
}

function PlaylistTasks({ tasks, teamId, moduleId, stage, toggleModal }) {
  const [currentStage, setCurrentStage] = useState(stage);

  // These functions are used to control the buttons which control the day to
  // show the playlist for
  function nextStage() {
    if (currentStage >= tasks.length - 1) return;
    setCurrentStage(currentStage + 1);
  }
  function prevStage() {
    if (currentStage <= 0) return;
    setCurrentStage(currentStage - 1);
  }

  const tasksForStage = tasks[currentStage];
  const taskItems = tasksForStage.map((task) => {
    return <IonItem>{task.desc}</IonItem>;
  });

  const buttonsDisabled = currentStage !== stage;

  return (
    <>
      <IonItem lines="none" style={{ "--padding-top": "25px" }}>
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
                  disabled={currentStage >= tasks.length - 1}
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
      <IonItem
        lines="none"
        style={{ "--padding-top": "10px", "--padding-bottom": "0px" }}
      >
        <IonGrid>
          <IonRow>
            <IonCol>
              <div class="ion-text-center">
                <IonButton size={"small"} disabled={buttonsDisabled}>
                  <IonIcon icon={calendarOutline} />
                </IonButton>
                <IonButton
                  disabled={buttonsDisabled}
                  routerLink={
                    "/move/timer/" + teamId + "/" + moduleId + "/" + stage
                  }
                  onClick={() => {
                    console.log("toggling modal after i clicked");
                    console.log(toggleModal);
                    toggleModal();
                  }}
                  size={"large"}
                  shape={"round"}
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
      <PlaylistTasks
        stage={currentStage}
        tasks={module.tasks}
        teamId={team._id}
        moduleId={module._id}
        toggleModal={closeModal}
      />
    </>
  );
}

export default PlaylistDetail;
