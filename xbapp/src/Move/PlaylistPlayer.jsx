import React, { useState, useRef } from "react";
import {
  IonButton,
  IonIcon,
  IonCol,
  IonGrid,
  IonRow,
  IonItem,
  IonContent,
  IonText,
  IonSpinner,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItemGroup,
  IonLabel,
} from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import { connect } from "react-redux";

import "./PlaylistPlayer.css";

import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";

import { addControllersProp } from "../util_model/controllers";
import inputFactory from "../Boxes/inputFactory";
import Timer from "../Instruments/StatelessTimer";
import ManualTime from "../Instruments/ManualTimeEntry";
import XBHeader from "../util/XBHeader";
import getTaskIcon from "./components/TaskIcons";

function TaskAccordionList({ tasks, taskIdx, currentTask }) {
  return (
    <>
      <Accordion className="AccordionBox">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <IonCol>
            <Typography>
              <IonItem lines="none" color="primary">
                <IonIcon icon={getTaskIcon(currentTask.verb)} slot="start" />
                {currentTask.desc}
                <IonLabel slot="end">
                  {taskIdx}/{tasks.length}
                </IonLabel>
              </IonItem>
            </Typography>
          </IonCol>
        </AccordionSummary>
        <AccordionDetails className="AccordionDetails">
          <IonGrid className="ion-no-padding ion-text-wrap">
            <IonItemGroup>{tasks}</IonItemGroup>
          </IonGrid>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

function InfoTopBar({ module, stage, tasks, currentTaskIdx, setCurrentTask }) {
  const currentTask = tasks[currentTaskIdx];
  const taskItems = tasks.map((task, index) => {
    return (
      <IonRow className="ion-no-padding">
        <IonCol className="ion-no-padding">
          <IonItem
            button
            detail={false}
            key={index}
            color={index === currentTaskIdx ? "secondary" : "transparent"}
            lines="none"
            onClick={() => {
              setCurrentTask(index);
            }}
          >
            <IonIcon icon={getTaskIcon(task.verb)} slot="start" />
            <IonLabel className="ion-text-wrap">{task.desc}</IonLabel>
          </IonItem>
        </IonCol>
      </IonRow>
    );
  });

  return (
    <>
      <IonItem lines="none">
        <IonGrid>
          <IonRow>
            {/* <IonCol size="1" style={{ "background-color": colour }}></IonCol> */}
            <IonCol>
              <IonRow>
                <IonCol>
                  <IonItem lines="none">
                    <IonLabel
                      style={{ "font-size": "1.2em", "font-weight": "bold" }}
                    >
                      <IonText className="ion-text-wrap">{module.name}</IonText>
                    </IonLabel>
                    <IonLabel slot="end">
                      <IonText>Stage {stage + 1}</IonText>
                    </IonLabel>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <TaskAccordionList
                    tasks={taskItems}
                    taskIdx={currentTaskIdx + 1}
                    currentTask={currentTask}
                  />
                </IonCol>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </>
  );
}

function TaskTimer({ task, team, manualEntry, setManualEntry, setMinutes }) {
  let content;

  if (manualEntry) {
    content = (
      <>
        <ManualTime id={team._id} task={task} onChange={setMinutes} />
      </>
    );
  } else {
    content = (
      <>
        <IonCol>
          {/* entry from timer */}
          <Timer
            id={team._id}
            active="false"
            onPause={(minutes) => setMinutes(minutes)}
          />
          <p style={{ textAlign: "center", paddingTop: "5px" }}>
            Stop the timer when you're done
          </p>
        </IonCol>
      </>
    );
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Time Your Session</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow>{content}</IonRow>
          <IonRow>
            <IonCol
              style={{
                padding: "0px",
                textAlign: "center",
                paddingBottom: "20px",
              }}
            >
              <IonButton
                onClick={() => {
                  setManualEntry(!manualEntry);
                }}
              >
                <IonIcon icon={addCircleOutline} /> &nbsp;
                {manualEntry ? "Back to timer" : "Enter minutes manually"}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
}

function PlaylistPlayer(props) {
  const [currentTaskIdx, setCurrentTaskIdx] = useState(0);
  const [externalResponse, setExternalResponse] = useState({});
  const [minutes, setMinutes] = useState(0);
  const [manualTimeEntry, setManualEntry] = useState(false);

  props.controllers.LOAD_TEAMS_IF_REQD();
  props.controllers.LOAD_MODULES_IF_REQD();
  props.controllers.SET_USER_PROFILE_IF_REQD();

  if (
    !props.teams.loaded ||
    !props.modules.loaded ||
    !props.userProfile.loaded
  ) {
    return <IonSpinner name="crescent" class="center-spin" />;
  }

  const team = props.teams.teams.bybox["move"][0];
  const moduleId = props.match.params.moduleId;
  const stage = parseInt(props.match.params.stage, 10);
  const userProfile = props.userProfile.userProfile;

  // This may not scale very well if we have a lot of modules in the future
  const module = props.modules.modules.find((m) => m._id === moduleId);
  if (!module) {
    return <div>The requested playlist could not be found for some reason</div>;
  }

  const tasks = module.playlists[stage].tasks;
  const currentTask = { ...tasks[currentTaskIdx] };
  currentTask["moduleId"] = module._id;

  // Save the time spent on the tasks
  async function saveResponse() {
    let response = {};
    // Add data from task's protoResponse if required
    for (let k of Object.keys(currentTask.protoResponse ?? {})) {
      response[k] = currentTask.protoResponse[k];
    }
    // Add data from widgets
    for (let k of Object.keys(externalResponse)) {
      response[k] = externalResponse[k];
    }
    // Add additional data and save
    response.type = currentTask.type;
    response.intype = currentTask.intype;
    response.minutes = minutes;
    response.day = team.experiment.day;
    response.moduleId = moduleId;
    response.stage = stage;
    await props.controllers.ADD_RESPONSE(team._id, response);
  }

  async function progressStage() {
    await props.controllers.PROGRESS_ALONG_MODULE(moduleId);
  }

  // Update the response from the widgets
  function updateResponse(response) {
    console.log("Updating response with", response);
    let updated = {};
    for (let k of Object.keys(externalResponse)) {
      updated[k] = externalResponse[k];
    }
    for (let k of Object.keys(response)) {
      updated[k] = response[k];
    }
    if (Object.keys(response).includes("minutes")) {
      setMinutes(response.minutes);
    }
    setExternalResponse(updated);
    console.log("Updated response", externalResponse);
  }

  let readyToSave = minutes > 0;

  // Go to the next task
  function nextTask() {
    if (currentTaskIdx < tasks.length - 1) {
      setCurrentTaskIdx(currentTaskIdx + 1);
      if (readyToSave) {
        saveResponse();
      }
      setExternalResponse({});
      setMinutes(0);
    }
  }

  // Go to the previous task
  function prevTask() {
    if (currentTaskIdx > 0) {
      setCurrentTaskIdx(currentTaskIdx - 1);
      if (readyToSave) {
        saveResponse();
      }
      setExternalResponse({});
      setMinutes(0);
    }
  }

  // For an EDT set, we need to get the moves from somewhere, probably the
  // user's profile
  if (currentTask.intype === "s22edtset") {
    const edtTasks = tasks.filter((task) => task.intype === "s22edtset");
    const moveTypes = [];
    for (let task of edtTasks) {
      moveTypes.push(task.edtMoves);
    }
    currentTask["moveTypes"] = moveTypes; // required for setting moves for all blocks

    // Get the moves from the user's profile
    currentTask["chosenMoves"] = userProfile.modules[module._id].moves;
  }

  const taskContent = inputFactory(
    currentTask.intype,
    team,
    stage,
    updateResponse,
    userProfile,
    currentTask
  );

  return (
    <IonPage>
      <XBHeader title={"Movement"} colour={module.info.colour} />
      <IonContent>
        <InfoTopBar
          module={module}
          stage={stage}
          tasks={tasks}
          currentTaskIdx={currentTaskIdx}
          setCurrentTask={(index) => {
            setCurrentTaskIdx(index);
          }}
        />
        {/* Task specific UI */}
        {taskContent.input}
        {/* Timer or Save Activity */}
        {currentTask.timed ? (
          <TaskTimer
            task={currentTask}
            team={team}
            manualEntry={manualTimeEntry}
            setManualEntry={setManualEntry}
            setMinutes={setMinutes}
          />
        ) : (
          ""
        )}
        {/* Previous and next task buttons */}
        <IonItem lines="none" color="transparent">
          <IonGrid className="PlaylistNavigation">
            <IonRow>
              <IonCol>
                <IonButton
                  expand="block"
                  onClick={prevTask}
                  disabled={currentTaskIdx <= 0}
                  size="normal"
                >
                  Previous
                </IonButton>
              </IonCol>
              <IonCol>
                {currentTaskIdx < tasks.length - 1 ? (
                  <IonButton expand="block" onClick={nextTask} size="normal">
                    Next
                  </IonButton>
                ) : (
                  <IonButton
                    expand="block"
                    routerLink={"/move/task-playlist"}
                    onClick={() => {
                      saveResponse();
                      progressStage();
                    }}
                    size="normal"
                  >
                    Finish
                  </IonButton>
                )}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      </IonContent>
    </IonPage>
  );
}

export default connect((state, ownProps) => {
  return {
    teams: state.teams,
    modules: state.modules,
    userProfile: state.userProfile,
  };
}, {})(addControllersProp(PlaylistPlayer));
