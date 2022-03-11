import React, { useState } from "react";
import {
  IonButton,
  IonIcon,
  IonCol,
  IonGrid,
  IonRow,
  IonItem,
  IonContent,
  IonList,
  IonSpinner,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
  IonPopover,
  IonItemGroup,
} from "@ionic/react";
import {
  addCircleOutline,
  informationCircleOutline,
  arrowForwardOutline,
} from "ionicons/icons";
import { connect } from "react-redux";

import { addControllersProp } from "../util_model/controllers";
import inputFactory from "../Boxes/inputFactory";
import Timer from "../Instruments/StatelessTimer";
import TotalTimer from "./components/TotalTimer";
import ManualTime from "./components/ManualEntry";
import XBHeader from "../util/XBHeader";

function TimerTopBar({ module, stage, tasks, currentTaskIdx, setCurrentTask }) {
  const taskItems = tasks.map((task, index) => {
    return (
      <IonItem
        button
        color={index === currentTaskIdx ? "warning" : ""}
        lines="none"
        onClick={() => {
          setCurrentTask(index);
        }}
      >
        {task.desc}
      </IonItem>
    );
  });

  return (
    <>
      <IonItem lines="none">
        <IonGrid>
          <IonRow>
            <IonCol>
              <strong>{module.name}</strong>
            </IonCol>
            <IonCol>Stage {stage}</IonCol>
          </IonRow>
          <IonRow></IonRow>
        </IonGrid>
      </IonItem>
      <IonItem lines="none">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonList>
                <IonItemGroup>{taskItems}</IonItemGroup>
              </IonList>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              {currentTaskIdx + 1} of {taskItems.length}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </>
  );
}

function TimerThing({ task, team }) {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Time Your Session</IonCardTitle>
        <IonCardSubtitle>
          Record the time you spend on this activity; it counts towards your
          daily target
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              {/* entry from timer */}
              <Timer id={team._id} active="false" onPause={() => {}} />
              <p style={{ textAlign: "center" }}>
                Stop the timer when you're done
              </p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
}

function PlaylistTimer(props) {
  const [currentTaskIdx, setCurrentTaskIdx] = useState(0);

  props.controllers.LOAD_TEAMS_IF_REQD();
  props.controllers.LOAD_MODULES_IF_REQD();

  if (!props.teams.loaded || !props.modules.loaded) {
    return <IonSpinner name="crescent" class="center-spin" />;
  }

  const team = props.teams.teams.bybox["move"][0];
  const moduleId = props.match.params.moduleId;
  const stage = props.match.params.stage;

  // TODO: this probably won't scale very well
  const module = props.modules.modules.find((m) => m._id === moduleId);
  if (!module) {
    return <IonSpinner name="crescent" class="center-spin" />;
  }

  const name = module.name;
  const tasks = module.tasks[stage];
  const currentTask = tasks[currentTaskIdx];

  function skipTask() {
    if (currentTaskIdx < tasks.length - 1) {
      setCurrentTaskIdx(currentTaskIdx + 1);
    }
  }

  function finishPlaylist() {
    setCurrentTaskIdx(0);
  }

  function setCurrentTask(index) {
    setCurrentTaskIdx(index);
  }

  function updateResponse() {}

  const timerContent = inputFactory(
    currentTask.intype,
    team,
    stage,
    updateResponse,
    currentTask
  );

  return (
    <IonPage>
      <XBHeader title={"Movement"} />
      <IonContent>
        <TimerTopBar
          module={module}
          stage={stage}
          tasks={tasks}
          currentTaskIdx={currentTaskIdx}
          setCurrentTask={setCurrentTask}
        />
        {timerContent.input}
        {currentTask.timed ? <TimerThing task={currentTask} team={team} /> : ""}
        <IonRow>
          <IonCol>
            {currentTaskIdx < tasks.length - 1 ? (
              <IonButton expand="full" onClick={skipTask}>
                Next
              </IonButton>
            ) : (
              <IonButton
                expand="full"
                onClick={finishPlaylist}
                routerLink={"/move/task-playlist"}
              >
                Finish
              </IonButton>
            )}
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
}

export default connect((state, ownProps) => {
  return {
    teams: state.teams,
    modules: state.modules,
  };
}, {})(addControllersProp(PlaylistTimer));
