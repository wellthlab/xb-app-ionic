import { useState } from "react";
import {
  IonItem,
  IonContent,
  IonSpinner,
  IonPage,
  IonText,
  useIonToast,
} from "@ionic/react";
import { happyOutline } from "ionicons/icons";
import { connect } from "react-redux";

import { addControllersProp } from "../util_model/controllers";
import { preparePlaylist, prepareTask } from "./components/util";
import XBHeader from "../util/XBHeader";
import XBInfo from "../util/XBInfo";
import inputFactory from "../Boxes/inputFactory";
import TaskTimer from "./components/player/TaskTimer";
import PlaylistInfo from "./components/player/PlaylistInfo";
import PlaylistProgressionButtons from "./components/player/PlaylistProgressionButtons";
import InstructionsAccordion from "./components/player/InstructionAccordion";

import "./css/PlaylistPlayer.css";

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
 * @param props.match.params.startingTask
 * @param props.match.params.mode
 */
function PlaylistPlayer(props) {
  const [externalResponse, setExternalResponse] = useState({});
  const [minutes, setMinutes] = useState(0);
  const [manualTimeEntry, setManualEntry] = useState(false);
  const [showSavedToast] = useIonToast();
  const [finishedAlert] = useIonToast();
  const [currentTaskIdx, setCurrentTaskIdx] = useState(
    parseInt(props.match.params.startingTask, 10)
  );

  const readyToSave = minutes > 0;
  const playlistPlayingIdx = parseInt(props.match.params.playlistIdx, 10);
  const playlistUserProgressIdx = parseInt(props.match.params.progress, 10);
  const isExplore = props.match.params.mode === "explore";

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

  // This may not scale very well if we have a lot of modules in the future
  const module = props.modules.modules.find((m) => m._id === moduleId);
  const isSnack = module.topic.includes("snack/");

  if (!module) {
    return (
      <div>The requested playlist could not be found for some reason :-(</div>
    );
  }

  // Get the tasks for the playlist and prepare the current task
  const tasks = preparePlaylist(module.playlists[playlistPlayingIdx].tasks);
  const currentTask = prepareTask(tasks, currentTaskIdx, module);

  // Progress the user to the next playlist using the controller
  async function progressToNextPlaylist() {
    // no progression is possible for movement snacks, but can cause issues if
    // we do try to progress someone along a movement snack
    if (!isSnack) {
      await props.controllers.PROGRESS_ALONG_MODULE(moduleId);
    }
  }

  // Save the time spent on the tasks
  async function saveResponse() {
    if (isExplore) return;
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
    response.playlist = playlistPlayingIdx;

    response.moduleId = moduleId;
    // This is used to determine if the user has completed the playlist for
    // the day or not. If they are replaying old playlists, should we count
    // the playlist as being completed today?
    if (playlistPlayingIdx === playlistUserProgressIdx) {
      response.tickModuleDone = true;
    }

    await props.controllers.ADD_RESPONSE(team._id, response);

    if (currentTaskIdx === tasks.length - 1) {
      await finishedAlert({
        header: "Well done, you completed the playlist!",
        position: "top",
        color: "success",
        duration: 3000,
        buttons: ["OK"],
        icon: happyOutline,
      });
    } else {
      await showSavedToast({
        color: "success",
        message: "Your minutes have been saved",
        position: "top",
        duration: 2500,
        buttons: ["OK"],
      });
    }
    // Only progress along playlists IF the user is on their latest playlist.
    // The model here allows a user to progress to the next playlist if they
    // interact with any part of the playlist
    if (playlistPlayingIdx === playlistUserProgressIdx) {
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

  // Go to the next task in the playlist
  // The response object is cleared and minutes set to 0 so the user starts over
  async function nextTaskInPlaylist() {
    setMinutes(0);
    if (currentTaskIdx < tasks.length - 1) {
      setCurrentTaskIdx(currentTaskIdx + 1);
    }
    if (readyToSave) {
      await saveResponse();
    }
    setMinutes(0);
    setExternalResponse({});
  }

  // Go to the previous task in the playlist
  // The response object is cleared and minutes set to 0 so the user starts over
  async function prevTaskInPlaylist() {
    if (currentTaskIdx > 0) {
      setCurrentTaskIdx(currentTaskIdx - 1);
    }
    if (readyToSave) {
      await saveResponse();
    }
    setMinutes(0);
    setExternalResponse({});
  }

  // The UI to display for the specific task being played is returned from the
  // input factory
  // TODO: we need to pass if this isExplore as well, as some tasks will
  //       have extra timers as well which we dont want to show
  const taskContent = inputFactory(
    currentTask.intype,
    team,
    playlistPlayingIdx,
    currentTaskIdx,
    userProfile,
    updateResponse,
    currentTask
  );

  return (
    <IonPage>
      <XBHeader
        title={isExplore ? `Explore: ${module.name}` : module.name}
        colour={module.info.colour}
      />
      <IonContent>
        <PlaylistInfo
          module={module}
          currentPlaylist={playlistPlayingIdx}
          tasks={tasks}
          currentTaskIdx={currentTaskIdx}
          setCurrentTask={(index) => {
            setCurrentTaskIdx(index);
          }}
          isSnack={isSnack}
        />
        {/* Bar to say we're in explore mode */}
        {isExplore ? (
          <XBInfo
            title={
              <>
                <IonText>
                  <h1>Exploration Mode</h1>
                  <h4>No progress will be saved</h4>
                </IonText>
              </>
            }
          />
        ) : (
          ""
        )}
        {/* Instruction bar */}
        {currentTask.instructions &&
        currentTask.intype !== "s22instructions" ? (
          <InstructionsAccordion instructions={currentTask.instructions} />
        ) : (
          ""
        )}
        {/* Task specific UI */}
        {taskContent.input}
        {/* Timer or Save Activity */}
        {currentTask.timed && !isExplore ? (
          <TaskTimer
            task={currentTask}
            team={team}
            useManualEntry={manualTimeEntry}
            setManualEntry={setManualEntry}
            setMinutes={setMinutes}
            minutes={minutes}
          />
        ) : (
          ""
        )}
        {/* Previous and next task buttons */}
        <IonItem
          lines="none"
          color="transparent"
          style={{ "--padding-start": "0px", "--inner-padding-end": "0px" }}
        >
          <PlaylistProgressionButtons
            numTasks={tasks.length}
            currentTaskIdx={currentTaskIdx}
            goToNextTask={nextTaskInPlaylist}
            goToPrevTask={prevTaskInPlaylist}
            teamId={team._id}
            moduleId={moduleId}
            playlistIdx={playlistPlayingIdx}
          />
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
