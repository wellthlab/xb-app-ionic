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
                You are currently at <strong>STAGE</strong> {stage} out of{" "}
                {numStages}
              </IonText>
            </IonCol>
          </IonRow>
        </IonItem>
        <IonRow>
          <IonCol>
            <IonProgressBar value={stage / numStages} />
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
}

function PlaylistTasks({ tasks, teamId, moduleId, stage }) {
  const [currentStage, setCurrentStage] = useState(stage);

  // These functions are used to control the buttons which control the day to
  // show the playlist for
  function nextStage() {
    if (currentStage === stage) return;
    setCurrentStage(currentStage + 1);
  }
  function prevStage() {
    if (currentStage <= 0) return;
    setCurrentStage(currentStage - 1);
  }

  const tasksForStage = tasks[currentStage];
  const taskItems = tasksForStage.map((task) => {
    return <IonItem button>{task.desc}</IonItem>;
  });

  const buttonsDisabled = currentStage !== stage;

  return (
    <>
      <IonItem lines="none" style={{ "--padding-top": "25px" }}>
        <IonGrid>
          {/* Buttons for switching playlist stage */}
          <IonRow>
            <IonCol>
              <div class="ion-text-center">
                <IonButton onClick={prevStage} size="default">
                  <IonIcon icon={chevronBackCircleOutline} />
                </IonButton>
              </div>
            </IonCol>
            <IonCol>
              <div class="ion-text-center">
                <IonText>
                  <h4>Stage {currentStage}</h4>
                </IonText>
              </div>
            </IonCol>
            <IonCol>
              <div class="ion-text-center">
                <IonButton onClick={nextStage} size="default">
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
                size={"large"}
                shape={"round"}
              >
                <IonIcon icon={playOutline} />
              </IonButton>
            </div>
          </IonCol>
        </IonGrid>
      </IonItem>
    </>
  );
}

function PlaylistDetail({ team, modules, moduleId, currentStage }) {
  const module = modules.find((m) => m._id === moduleId);
  return (
    <>
      <PlaylistDescription module={module} stage={currentStage} />
      <PlaylistTasks
        stage={currentStage}
        tasks={module.tasks}
        teamId={team._id}
        moduleId={module._id}
      />
    </>
  );
}

export default PlaylistDetail;
