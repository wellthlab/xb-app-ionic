import { IonContent, IonPage, IonSpinner, IonText } from "@ionic/react";
import { connect } from "react-redux";
import { addControllersProp } from "../util_model/controllers";

import "./css/PlaylistSubscriber.css";

import XBHeader from "../util/XBHeader";
import XBInfo from "../util/XBInfo";
import ModulesToPickList from "./components/module/PlaylistPickerCard";
import { updateUserProfileModules } from "./components/util";

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function ModulePicker(props) {
  props.controllers.LOAD_TEAMS_IF_REQD();
  props.controllers.LOAD_MODULES_IF_REQD();
  props.controllers.SET_USER_PROFILE_IF_REQD();

  if (
    !props.teams.loaded ||
    !props.modules.loaded ||
    !props.userProfile.loaded
  ) {
    return <IonSpinner name="crescent" className="center-spin" />;
  }

  const topic = props.match.params.topic;
  const isSnack = topic.includes("snack");
  const topicForDisplay = isSnack ? "snack" : topic;
  const infoMsg = isSnack
    ? "A movement snack is a quick way to get moving. You can " +
      "choose to either move alone, or with a group, by " +
      "hitting the play button for the snack you want to play."
    : "Pick a curated movement playlist below to get moving! Each " +
      "playlist is made up of daily movement sequences aimed at getting you " +
      "moving each day to build a habit. As you progress through the sequences, " +
      "the difficulty will slowly increase, but you can always replay a previous " +
      "sequence if it gets too difficult.";

  let pageTitle;
  switch (topicForDisplay) {
    case "snack":
      pageTitle = "Movement Snacks";
      break;
    case "strength":
      pageTitle = "Strength Training";
      break;
    case "endurance":
      pageTitle = "Endurance Training";
      break;
    case "neuro":
      pageTitle = "Neuromobility";
      break;
    default:
      pageTitle = "Move";
  }

  const team = props.teams.teams.bybox["move"][0];
  const availableModules = props.modules.modules;
  const profile = props.userProfile.userProfile;

  let usersModules = {
    ...profile.modules,
  };

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
      topic: topic,
      stage: stage,
      active: checked,
    };

    await updateUserProfileModules(
      profile,
      usersModules,
      props.controllers.UPDATE_USER_PROFILE
    );
  }

  // get all modules for a topic -- topic looks like "mainTopic" or
  // "mainTopic/subTopics" and filter out own-movement playlists
  const modulesForTopic = availableModules.filter(
    (module) =>
      module.topic.split("/").includes(topic) &&
      !module.topic.includes("/own-movement")
  );

  // If there are no modules for the topic, then return
  if (modulesForTopic.length === 0) {
    return (
      <IonPage>
        <XBHeader title={"Move"} />
        <IonContent>
          <IonText className="vcs ion-text-header ion-text-wrap">
            There is nothing available at this moment, please check back later
          </IonText>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <XBHeader title={"Move"} />
      <IonContent>
        <XBInfo
          title={<strong>{pageTitle}</strong>}
          desc={
            <IonText>
              <h5>{infoMsg}</h5>
            </IonText>
          }
        />
        <ModulesToPickList
          modulesForTopic={modulesForTopic}
          team={team}
          usersModules={usersModules}
          updateUserModuleObject={updateUserModuleObject}
        />
      </IonContent>
    </IonPage>
  );
}

export default connect((state, ownProps) => {
  return {
    teams: state.teams,
    userProfile: state.userProfile,
    modules: state.modules,
  };
}, {})(addControllersProp(ModulePicker));
