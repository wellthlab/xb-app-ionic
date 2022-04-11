import React, { useState } from "react";
import {
  IonButton,
  IonIcon,
  IonCol,
  IonGrid,
  IonRow,
  IonItem,
  IonContent,
  IonSpinner,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import { connect } from "react-redux";

import "./PlaylistPlayer.css";

import { addControllersProp } from "../util_model/controllers";
import inputFactory from "../Boxes/inputFactory";
import Timer from "../Instruments/StatelessTimer";
import ManualTime from "../Instruments/ManualTimeEntry";
import XBHeader from "../util/XBHeader";
import PlaylistInfoBarWithTasks from "./components/PlaylistInfoBarWithTasks";
import UserProfile from "../UserProfile/UserProfile";

/**
 * Timer UI for timing tasks, or manual entry of minutes
 *
 * @param task
 * @param team
 * @param manualEntry
 * @param setManualEntry
 * @param setMinutes
 */

function TaskTimer({ task, team, useManualEntry, setManualEntry, setMinutes }) {
  let content;

  if (useManualEntry) {
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
                  setManualEntry(!useManualEntry);
                }}
              >
                <IonIcon icon={addCircleOutline} /> &nbsp;
                {useManualEntry ? "Back to timer" : "Enter minutes manually"}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
}

/**
 * Provides previous and next buttons at the bottom of the playlist player
 * to navigate through the playlist tasks
 *
 * @param numTasks
 * @param currentTaskIdx
 * @param nextTaskInPlaylist
 * @param prevTaskInPlaylist
 * @param saveOnFinish
 */
function PlayerProgressionButtons({
  numTasks,
  currentTaskIdx,
  nextTaskInPlaylist,
  prevTaskInPlaylist,
  saveOnFinish,
}) {
  return (
    <IonItem lines="none" color="transparent">
      <IonGrid className="PlaylistNavigation">
        <IonRow>
          <IonCol>
            <IonButton
              expand="block"
              onClick={prevTaskInPlaylist}
              disabled={currentTaskIdx <= 0}
              size="normal"
            >
              Previous
            </IonButton>
          </IonCol>
          <IonCol>
            {currentTaskIdx < numTasks - 1 ? (
              <IonButton
                expand="block"
                onClick={nextTaskInPlaylist}
                size="normal"
              >
                Next
              </IonButton>
            ) : (
              <IonButton
                expand="block"
                routerLink={"/move/task-playlist"}
                onClick={saveOnFinish}
                size="normal"
              >
                Finish
              </IonButton>
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
}

/**
 * The main UI element for displaying playlist information, task specific UI
 * and saving responses and progressing the user along their module
 *
 * @param props.controllers
 * @param props.modules
 * @param props.teams
 * @param props.match.params.moduleId
 * @param props.match.params.playlistIdx
 * @param props.match.params.progress
 */
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

  const userProfile = props.userProfile.userProfile;
  const team = props.teams.teams.bybox["move"][0];
  const moduleId = props.match.params.moduleId;
  const playlistIdx = parseInt(props.match.params.playlistIdx, 10);
  const userProgress = parseInt(props.match.params.progress, 10);

  // This may not scale very well if we have a lot of modules in the future
  const module = props.modules.modules.find((m) => m._id === moduleId);

  if (!module) {
    return <div>The requested playlist could not be found for some reason</div>;
  }

  const tasks = module.playlists[playlistIdx].tasks.filter(
    (task) => Object.keys(task).length !== 0
  );

  // Get the task, and add some useful data as well to be passed around
  const currentTask = { ...tasks[currentTaskIdx] };
  currentTask.moduleId = moduleId;
  currentTask.module = module;

  // We need more useful data for the EDT set
  if (currentTask.intype === "s22edtset") {
    const edtTasks = tasks.filter((task) => task.intype === "s22edtset");
    const moveTypes = [];
    for (let task of edtTasks) {
      moveTypes.push(task.edtMoves);
    }

    currentTask.moveTypes = moveTypes;
  }

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
    response.playlist = playlistIdx;

    // This is used to determine if the user has completed the playlist for
    // the day or not. If they are replaying old playlists, should we count
    // the playlist as being completed today?
    // if (playlistIdx === userProgress) {
    response.moduleId = moduleId;
    // }

    await props.controllers.ADD_RESPONSE(team._id, response);
    // Only progress along playlists IF the user is on their latest playlist.
    // The model here allows a user to progress to the next playlist if they
    // interact with any part of the playlist
    if (minutes > 0 && playlistIdx === userProgress) {
      await progressToNextPlaylist();
    }
  }

  // Update the response from the widgets
  function updateResponse(response) {
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
  }

  // Save the response and progress the user to the next playlist if they
  // press the finish button. But we shouldn't progress if the user just keeps
  // pressing the button to go next
  async function saveOnFinish() {
    await saveResponse();
    if (minutes > 0) {
      await progressToNextPlaylist();
    }
  }

  // Progress the user to the next playlist using the controller
  async function progressToNextPlaylist() {
    // no progression is possible for movement snacks, but can cause issues if
    // we do try to progress someone along a movement snack
    if (!module.topic.includes("snack/")) {
      await props.controllers.PROGRESS_ALONG_MODULE(moduleId);
    }
  }

  const readyToSave = minutes > 0;

  // Go to the next task in the playlist
  // The response object is cleared and minutes set to 0 so the user starts over
  function nextTaskInPlaylist() {
    if (currentTaskIdx < tasks.length - 1) {
      setCurrentTaskIdx(currentTaskIdx + 1);
      if (readyToSave) {
        saveResponse();
      }
      setExternalResponse({});
      setMinutes(0);
    }
  }

  // Go to the previous task in the playlist
  // The response object is cleared and minutes set to 0 so the user starts over
  function prevTaskInPlaylist() {
    if (currentTaskIdx > 0) {
      setCurrentTaskIdx(currentTaskIdx - 1);
      if (readyToSave) {
        saveResponse();
      }
      setExternalResponse({});
      setMinutes(0);
    }
  }

  // The UI to display for the specific task being played is returned from the
  // input factory
  const taskContent = inputFactory(
    currentTask.intype,
    team,
    playlistIdx,
    userProfile,
    updateResponse,
    currentTask
  );

  return (
    <IonPage>
      <XBHeader title="Movement" colour={module.info.colour} />
      <IonContent>
        <PlaylistInfoBarWithTasks
          module={module}
          currentPlaylist={playlistIdx}
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
            useManualEntry={manualTimeEntry}
            setManualEntry={setManualEntry}
            setMinutes={setMinutes}
          />
        ) : (
          ""
        )}
        {/* Previous and next task buttons */}
        <PlayerProgressionButtons
          numTasks={tasks.length}
          currentTaskIdx={currentTaskIdx}
          nextTaskInPlaylist={nextTaskInPlaylist}
          prevTaskInPlaylist={prevTaskInPlaylist}
          saveOnFinish={saveOnFinish}
        />
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
