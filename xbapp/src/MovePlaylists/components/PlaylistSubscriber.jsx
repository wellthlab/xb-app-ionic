import { useState } from "react";
import {
  IonLabel,
  IonItem,
  IonButton,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonItemGroup,
  IonToggle,
  IonText,
  IonThumbnail,
  IonImg,
  IonIcon,
} from "@ionic/react";
import parse from "html-react-parser";

import "./PlaylistSubscriber.css";
import GenericModal from "../../Info/components/GenericModal";
import { addControllersProp } from "../../util_model/controllers";
import { chevronBack, playCircleOutline } from "ionicons/icons";

/**
 * A component which includes the module colour, as well as the name and
 * description of the module. Depending on the topic, the button will either
 * include a subscription toggle or a play button (for snacks) to start the
 * movement snack immediately.
 *
 * @param team - the team object for the user
 * @param topic  - only the main topic is sent
 * @param module - the module object
 * @param userModules - the user's modules from their user profile
 * @param updatedModules - function to update the user's modules
 */
function ModuleItem({ team, topic, module, userModules, updateModules }) {
  // first check to see if the user is already subscribed
  let checked;
  if (module._id in userModules) {
    checked = userModules[module._id].active;
  } else {
    checked = false;
  }

  console.log("topic", topic);

  return (
    <IonItem>
      <IonGrid>
        <IonRow>
          <IonCol
            style={{
              "background-color": module.info.colour,
            }}
            size="1"
          ></IonCol>
          <IonCol>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonLabel slot="start" className="ion-text-wrap">
                    <IonText
                      style={{
                        "font-size": "1.2em",
                        "font-weight": "bold",
                      }}
                    >
                      {module.name}
                    </IonText>
                  </IonLabel>
                  {topic !== "snack" ? (
                    <IonToggle
                      slot="end"
                      checked={checked}
                      onIonChange={(e) => {
                        updateModules(
                          e.detail.checked,
                          module.name,
                          module._id,
                          topic
                        );
                      }}
                    />
                  ) : (
                    <IonButton
                      slot="end"
                      routerLink={
                        "/move/timer/" + team._id + "/" + module._id + "/0/0"
                      }
                    >
                      <IonIcon icon={playCircleOutline} />
                    </IonButton>
                  )}
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonText className="ion-text-justify">
                    {parse(module.info.desc)}
                  </IonText>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
}

function SubscribeToModule(props) {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(undefined);
  const [modalTopic, setModalTopic] = useState(undefined);
  const [subModules, setSubModules] = useState(false);

  const team = props.team;
  const availableModules = props.modules;
  const profile = props.userProfile;
  let userModules = {
    ...profile.modules,
  };

  // Update the user profile with the modules they have picked or removed
  function subscribeUser() {
    let user = {
      ...profile,
      modules: userModules,
    };
    props.controllers.UPDATE_USER_PROFILE(user);
  }

  // Update the userModules object for stuff which is ticked or been unticked
  // for the given topic
  let updatedSubscriptions = false;
  function updateModules(checked, moduleName, moduleId, topic) {
    let stage;
    if (moduleId in userModules) {
      stage = userModules[moduleId].stage;
    } else {
      stage = 0;
    }

    userModules[moduleId] = {
      id: moduleId,
      name: moduleName,
      topic: topic,
      stage: stage,
      active: checked,
    };

    updatedSubscriptions = true;
  }

  // Toggle to modal -- if the user has changed their subscriptions, then update
  // otherwise just close
  function toggleModal() {
    setShowModal(!showModal);
  }

  // Fill in data for subscription modal
  function createModal(title, topic) {
    toggleModal();
    setModalTitle(title);
    setModalTopic(topic);
  }

  // Create a list of available modules for a given topic. Displays the name and a
  // description of the module, and a toggle to subscribe
  function getModulesForTopic(topic) {
    // get all modules for a topic
    // topic looks like "strength" or "path/builder"
    const modulesForTopic = availableModules.filter((module) =>
      module.topic.split("/").includes(topic)
    );

    // create an array of the actual topics (without any duplicates)
    // assumes the format of mainTopic/subTopic
    const subTopics = [
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
          .filter((el) => el !== null)
      ),
    ].sort(); // lol now this is a bit of a mess

    let content;

    if (subTopics.length === 0) {
      content = modulesForTopic.map((module) => {
        return (
          <ModuleItem
            team={team}
            topic={topic}
            module={module}
            userModules={userModules}
            updateModules={updateModules}
          />
        );
      });
    } else {
      //
      if (subModules) {
        // Then the user has clicked the subtopic button
        const moduleThing = subModules.map((module) => {
          return (
            <>
              <ModuleItem
                team={team}
                topic={topic}
                module={module}
                userModules={userModules}
                updateModules={updateModules}
              />
            </>
          );
        });

        content = (
          <>
            <IonButton
              onClick={() => {
                setSubModules(false);
              }}
            >
              <IonIcon icon={chevronBack} />
              Back
            </IonButton>
            {moduleThing}
          </>
        );
        //
      } else {
        // Then we need to display all of the main topics
        content = subTopics.map((subTopic) => {
          // why isn't this a method for strings?
          function capitalize(s) {
            return s.charAt(0).toUpperCase() + s.slice(1);
          }

          const subModules = modulesForTopic.filter((module) => {
            return module.topic.split("/")[1] === subTopic;
          });

          return (
            <>
              <IonItem
                button
                onClick={() => {
                  setSubModules(subModules);
                }}
              >
                <IonRow>
                  <IonCol>
                    <IonLabel>{capitalize(subTopic)}</IonLabel>
                  </IonCol>
                </IonRow>
              </IonItem>
            </>
          );
        });
      }
    }

    return content;
  }

  function SubscriptionModal({ topic }) {
    const playlists = getModulesForTopic(topic);
    if (playlists.length === 0) {
      return (
        <IonItem lines="none">
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonText className="ion-text-center">
                  <h1>There are no playlists available for this topic</h1>
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="full"
                  size="normal"
                  onClick={() => {
                    toggleModal();
                  }}
                >
                  Close
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      );
    } else {
      return (
        <>
          <IonItem lines="none">
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonList>
                    <IonItemGroup>{playlists}</IonItemGroup>
                  </IonList>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol>
                  <IonButton
                    expand="full"
                    size="normal"
                    onClick={() => {
                      if (updatedSubscriptions) {
                        subscribeUser();
                      } else {
                        toggleModal();
                      }
                    }}
                  >
                    Close
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
        </>
      );
    }
  }

  function TopicSubscriptionButton({ topic, title, img }) {
    return (
      <IonItem
        button
        detail={true}
        expand="full"
        size="normal"
        onClick={() => {
          createModal(title, topic);
        }}
      >
        <IonThumbnail slot="start">
          <IonImg src={img}></IonImg>
        </IonThumbnail>
        <IonLabel>{title}</IonLabel>
      </IonItem>
    );
  }

  // Actual return for the main component
  // TODO: we should figure out the possible tags from the database, and just automatically generate this list
  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol>
            <TopicSubscriptionButton
              topic="path"
              title="Movement Paths"
              img="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <TopicSubscriptionButton
              topic="snack"
              title="Movement Snacks"
              img="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <TopicSubscriptionButton
              topic="strength"
              title="Strength"
              img="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <TopicSubscriptionButton
              topic="Endurance"
              title="Endurance"
              img="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <TopicSubscriptionButton
              topic="neuro"
              title="Neuromobility"
              img="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      {/* Modal */}
      <GenericModal
        showModal={showModal}
        toggleModal={() => {
          toggleModal();
          updateModules();
        }}
        hideMinimize={true}
        title={modalTitle}
        body={<SubscriptionModal topic={modalTopic} />}
      />
    </>
  );
}

export default addControllersProp(SubscribeToModule);
