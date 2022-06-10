import { useEffect, useState } from "react";
import { IonContent, IonPage, IonSpinner } from "@ionic/react";
import { connect } from "react-redux";

import { addControllersProp } from "../util_model/controllers";

import XBHeader from "../util/XBHeader";
import PlaylistWeekOverview from "./components/module/PlaylistWeekOverview";
import ModuleDetailDescription from "./components/module/ModuleDetailDescription";
import PlaylistTasksCard from "./components/module/PlaylistTasksCard";

import "./css/PlaylistDetail.css";

/**
 * Displays the details of a module. This includes the module description and
 * user progress, and a list of the tasks in each playlist in the module.
 * Playlists are displayed different depending on the "mode" of the component.
 *
 * In "play" mode, the user can only switch been days but is able to play.
 * In "explore" mode, the user is instead presented with an overview of the
 * playlists in the module, and cannot play.
 *
 * Things look a little different been modules and movement snacks. For a
 * movement snack, less information is shown because the user cannot progress
 * through multiple playlists, as snacks do not have multiple playlists.
 *
 * @param modules
 * @param userProfile
 * @param controllers
 * @param match
 *          - teamId
 *          - moduleId
 *          - progress
 *          - mode
 */
function ModuleDetail({ modules, userProfile, controllers, match }) {
  const teamId = match.params.teamId;
  const moduleId = match.params.moduleId;
  const progress = parseInt(match.params.progress, 10);
  const isPlaying = match.params.mode === "play";

  const [showWeekOverview, setShowWeekOverview] = useState(!isPlaying);
  const [userProgressIdx, setUserProgressIdx] = useState(progress);

  // not ideal, as can cause a crash if active-playlist not set
  const [currentPlaylistIdx, setCurrentPlaylistIdx] = useState(
    parseInt(localStorage.getItem("active-playlist"), 10)
  );

  // update userProgressIdx for when a user completes progresses, but
  // presses the back button instead of finishing the playlist.
  // in "play" mode the userProgressIdx is the actual progress in the module,
  // in "explore" mode it is the length of the playlists array so people can
  // explore the entire module.
  let modulePlaylists = undefined;
  useEffect(() => {
    if (isPlaying && userProfile.userProfile.modules) {
      if (userProfile.userProfile.modules[moduleId]) {
        setUserProgressIdx(userProfile.userProfile.modules[moduleId].stage);
      } else {
        setUserProgressIdx(0);
      }
    } else {
      if (!modulePlaylists) return; // if playlists is not loaded yet, don't update
      setUserProgressIdx(modulePlaylists.length);
    }
  }, [moduleId, userProfile, isPlaying, modulePlaylists]);

  controllers.LOAD_MODULES_IF_REQD();
  controllers.SET_USER_PROFILE_IF_REQD();

  if (!modules.loaded || !userProfile.loaded) {
    return <IonSpinner name="crescent" className="center-spin" />;
  }

  const profile = userProfile.userProfile;
  const module = modules.modules.find((m) => m._id === moduleId);
  modulePlaylists = module.playlists;
  const usersModules = {
    ...profile.modules,
  };

  // Update the userModules object for when a playlist has been started or
  // removed. Essentially flicks "active" around to update if the module is
  // active for a user or not.
  async function updateUserModuleObject(checked, moduleName, moduleId, topic) {
    // We need to do get this because some variables were stuck being readonly
    // in the redux store, so reconstructing the object was the easiest win.
    // spread { ...object} notation didn't work when I tried.
    usersModules[moduleId] = {
      id: moduleId,
      name: moduleName,
      active: checked,
      topic,
      stage: moduleId in usersModules ? usersModules[moduleId].stage : 0,
    };

    await controllers.UPDATE_USER_PROFILE({
      ...profile,
      modules: usersModules,
    });
  }

  // used to switch between the list view
  function toggleListView(index) {
    setShowWeekOverview(!showWeekOverview);
    setCurrentPlaylistIdx(index);
  }

  return (
    <IonPage>
      <XBHeader
        title={isPlaying ? "Move" : "Explore"}
        colour={module.info.colour}
      />
      <IonContent>
        <ModuleDetailDescription
          isPlaying={isPlaying}
          module={module}
          userProgressIdx={userProgressIdx}
          currentPlaylistIdx={currentPlaylistIdx}
          updateUserModuleObject={updateUserModuleObject}
        />
        {/* Show a breakdown of the tasks, split into days and weeks. Or show
         a card which shows the tasks for a playlist and the play buttons
         For reference: showWeekOverview === !isPlaying */}
        {showWeekOverview ? (
          <PlaylistWeekOverview
            module={module}
            toggleListView={toggleListView}
          />
        ) : (
          <PlaylistTasksCard
            isPlaying={isPlaying}
            module={module}
            teamId={teamId}
            userProgressIdx={userProgressIdx}
            currentPlaylistIdx={currentPlaylistIdx}
            setCurrentPlaylistIdx={setCurrentPlaylistIdx}
            toggleListView={toggleListView}
          />
        )}
      </IonContent>
    </IonPage>
  );
}

export default connect((state, ownProps) => {
  return {
    modules: state.modules,
    userProfile: state.userProfile,
  };
}, {})(addControllersProp(ModuleDetail));
