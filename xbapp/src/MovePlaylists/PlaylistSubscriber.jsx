import { useHistory } from "react-router-dom";
import {
  IonContent,
  IonPage,
  IonSpinner,
  IonCol,
  IonGrid,
  IonItem,
  IonRow,
  IonItemGroup,
  IonButton,
  IonFooter,
  IonText,
} from "@ionic/react";

import { connect } from "react-redux";
import { addControllersProp } from "../util_model/controllers";

import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";

import "./PlaylistSubscriber.css";

import XBHeader from "../util/XBHeader";
import ModuleSubscriptionItem from "./components/ModuleSubscriptionItem";
import ModuleDisplay from "./components/ModuleDisplay";

/**
 * Create a list of available modules for a given topic. Displays the name and a
 * description of the module, and a toggle to subscribe
 *
 *
 */
function Modules({
  availableModules,
  topic,
  team,
  usersModules,
  updateUsersModules,
}) {
  //
  // get all modules for a topic -- topic looks like "mainTopic" or
  // "mainTopic/subTopics"
  const modulesForTopic = availableModules.filter((module) =>
    module.topic.split("/").includes(topic)
  );

  if (modulesForTopic.length === 0) {
    console.log("There are no modules for", topic, modulesForTopic);
    return (
      <IonText className="vcs ion-text-header ion-text-wrap">
        There is nothing available for this topic
      </IonText>
    );
  }

  // now create an array of the actual (sub-)topics (without any duplicates)
  // which will be presented to the user.
  // lol this is a bit of a convoluted mess though
  const subTopics = [
    // we are creating a set because otherwise we ended up with duplicate
    // entries being presented
    ...new Set(
      modulesForTopic
        .map((module) => {
          const subTopic = module.topic.split("/")[1];
          if (subTopic) {
            return subTopic;
          } else {
            return null;
          }
        })
        // take care when the subtopic is missing for some reason
        .filter((el) => el !== null)
    ),
  ].sort(); // sort into alphabetical order

  // debugger;

  let pageContent;

  if (subTopics.length === 0) {
    // If there are no subtopics, then return just a list of subscription items
    pageContent = modulesForTopic.map((module) => {
      return (
        <ModuleSubscriptionItem
          team={team}
          topic={topic}
          module={module}
          userModules={usersModules}
          updateModules={updateUsersModules}
        />
      );
    });
  } else {
    // If there are subtopics, then each subtopic will be presented as an
    // accordion containing the modules for that subtopic
    pageContent = subTopics.map((subTopic) => {
      const modules = modulesForTopic.filter((module) => {
        return module.topic.split("/")[1] === subTopic;
      });
      const items = modules.map((module) => {
        return (
          <ModuleSubscriptionItem
            team={team}
            topic={topic}
            module={module}
            userModules={usersModules}
            updateModules={updateUsersModules}
            showColour={false}
          />
        );
      });

      return (
        <>
          <ModuleDisplay
            items={items}
            subTopic={subTopic}
            colour={modules[0].info.colour}
          />
        </>
      );
    });
  }

  return pageContent;
}

/**
 * Update the user profile with modules which have been subbed or unsubbed
 *
 * @param  oldProfile - the userProfile before update
 * @param  newModules - the updated user module object
 * @param  updateUser - the function to update the user profile in the DB
 */
async function updateUserProfileModules(oldProfile, newModules, updateUser) {
  let user = {
    ...oldProfile,
    modules: newModules,
  };
  await updateUser(user);
}

function ModuleSubscription(props) {
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
  const title = topic.includes("snack") ? "Pick a Snack" : "Add Playlists";

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

    // updatedModules = true;

    await updateUserProfileModules(
      profile,
      usersModules,
      props.controllers.UPDATE_USER_PROFILE
    );
  }

  return (
    <IonPage>
      <XBHeader title={title} />
      <IonContent>
        {/* modules */}
        <Modules
          availableModules={availableModules}
          topic={topic}
          team={team}
          usersModules={usersModules}
          updateUsersModules={updateUserModuleObject}
        />
      </IonContent>
      {/* save button */}
      {/* <IonFooter>
        <IonItem color="transparent" lines="none">
          <IonCol>
            <IonButton
              size="regular"
              expand="block"
              // routerLink="/move/task-playlist"
              onClick={() => {
                if (updatedModules) {
                  updateUserProfileModules(
                    profile,
                    usersModules,
                    props.controllers.UPDATE_USER_PROFILE
                  );
                }
              }}
            >
              Update
            </IonButton>
          </IonCol>
        </IonItem>
      </IonFooter> */}
    </IonPage>
  );
}

export default connect((state, ownProps) => {
  return {
    teams: state.teams,
    userProfile: state.userProfile,
    modules: state.modules,
  };
}, {})(addControllersProp(ModuleSubscription));
