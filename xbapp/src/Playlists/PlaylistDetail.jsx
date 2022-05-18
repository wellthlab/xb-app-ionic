import { useEffect, useState } from "react";
import { IonContent, IonPage, IonSpinner } from "@ionic/react";
import { connect } from "react-redux";

import "./css/PlaylistDetail.css";

import { addControllersProp } from "../util_model/controllers";
import XBHeader from "../util/XBHeader";
import DetailModuleDescription from "./components/module/DetailModuleDescription";
import PlaylistTaskCard from "./components/module/PlaylistTaskCard";
import PlaylistList from "./components/module/PlaylistList";

/**
 * Renders information for the module, as well as a list of tasks for the
 *  current playlist, as defined by the currentPlaylist variable.
 *
 * @param modules
 * @param userProfile
 * @param controllers
 * @param match
 */
function PlaylistDetail({ modules, userProfile, controllers, match }) {
  const teamId = match.params.teamId;
  const moduleId = match.params.moduleId;
  const progress = parseInt(match.params.progress, 10);
  const isPlaying = match.params.mode === "play";
  const [showListView, setShowListView] = useState(!isPlaying);
  const [userProgressIdx, setUserProgressIdx] = useState(progress);
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
  const usersModules = {
    ...profile.modules,
  };
  const module = modules.modules.find((m) => m._id === moduleId);
  modulePlaylists = module.playlists;

  // Update the userModules object for stuff which is ticked or been unticked
  // for the given topic
  // let updatedModules = false;
  async function updateUserModuleObject(checked, moduleName, moduleId, topic) {
    let stage;
    if (moduleId in usersModules) {
      stage = usersModules[moduleId].stage;
    } else {
      stage = 0;
    }

    usersModules[moduleId] = {
      id: moduleId,
      name: moduleName,
      active: checked,
      topic,
      stage,
    };

    await controllers.UPDATE_USER_PROFILE({
      ...profile,
      modules: usersModules,
    });
  }

  function toggleListView(index) {
    setShowListView(!showListView);
    setCurrentPlaylistIdx(index);
  }

  return (
    <IonPage>
      <XBHeader
        title={isPlaying ? "Move" : "Explore"}
        colour={module.info.colour}
      />
      <IonContent>
        <DetailModuleDescription
          isPlaying={isPlaying}
          module={module}
          userProgressIdx={userProgressIdx}
          currentPlaylistIdx={currentPlaylistIdx}
          updateUserModuleObject={updateUserModuleObject}
        />
        {showListView ? (
          <PlaylistList module={module} toggleListView={toggleListView} />
        ) : (
          <PlaylistTaskCard
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
}, {})(addControllersProp(PlaylistDetail));
