import { IonCard, IonItem, IonItemGroup, IonLabel } from "@ionic/react";
import PlaylistPickingDescription from "./PlaylistDescription";

/**
 *
 * @param modulesForTopic
 * @param team
 * @param usersModules
 * @param updateUserModuleObject
 * @param setShowListView
 * @returns {any[]}
 * @constructor
 */
function PlaylistPickerCard({
  modulesForTopic,
  team,
  usersModules,
  updateUserModuleObject,
  setShowListView,
}) {
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

  let content;

  if (subTopics.length === 0) {
    // If there are no subtopics, then return just a list of subscription items
    content = modulesForTopic.map((module) => {
      const topic = module.topic;
      return (
        <IonCard>
          <IonItem
            lines="none"
            style={{ "--ion-item-background": module.info.colour }}
          />
          <PlaylistPickingDescription
            team={team}
            topic={topic}
            module={module}
            userModules={usersModules}
            updateModules={updateUserModuleObject}
          />
        </IonCard>
      );
    });
  } else {
    // If there are subtopics, then each subtopic will be presented as an
    // accordion containing the modules for that subtopic
    content = subTopics.map((subTopic) => {
      // Get all modules for a subtopic
      const modules = modulesForTopic.filter((module) => {
        return module.topic.split("/")[1] === subTopic;
      });
      // Create a list of ModuleSubscriptionItems for each module
      const moduleDescForSubTopic = modules.map((module) => {
        const topic = module.topic;
        return (
          <PlaylistPickingDescription
            team={team}
            topic={topic}
            module={module}
            userModules={usersModules}
            updateModules={updateUserModuleObject}
            showColour={false}
          />
        );
      });
      // Display all the modules in a card, with the subtopic as the header and the colour as the first module colour
      return (
        <IonCard>
          <IonItem
            lines="none"
            style={{ "--ion-item-background": modules[0].info.colour }}
          >
            <IonLabel className="ion-text-center ion-text-header">
              {subTopic.toUpperCase()}
            </IonLabel>
          </IonItem>
          <IonItemGroup>{moduleDescForSubTopic}</IonItemGroup>
        </IonCard>
      );
    });
  }

  return content;
}

export default PlaylistPickerCard;
