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
  IonBadge,
} from "@ionic/react";
import { connect } from "react-redux";

import "./PlaylistSubscriber.css";
import GenericModal from "../../Info/components/GenericModal";
import { addControllersProp } from "../../util_model/controllers";

function SubscribeToModule(props) {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(undefined);
  const [modalTopic, setModalTopic] = useState(undefined);

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

  // Create a of available modules for a given topic. Displays the name and a
  // description of the module, and a toggle to subscribe
  function getPlaylist(topic) {
    return (
      availableModules
        // get all modules for a topic
        .filter((module) => module.topic === topic)
        // then map each module to a list item
        .map((module) => {
          // first check to see if the user is already subscribed
          let checked;
          if (module._id in userModules) {
            checked = userModules[module._id].active;
          } else {
            checked = false;
          }
          const colour = module.info.colour;

          return (
            <IonItem>
              <IonGrid>
                <IonRow>
                  <IonCol
                    style={{
                      "background-color": colour,
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
                                "font-size": "1.3em",
                                "font-weight": "bold",
                              }}
                            >
                              {module.name}
                            </IonText>
                          </IonLabel>
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
                        </IonItem>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonItem lines="none">
                          <IonText className="ion-text-justify">
                            {module.desc}
                          </IonText>
                        </IonItem>
                      </IonCol>
                    </IonRow>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          );
        })
    );
  }

  function ModuleSubscriptionModal({ topic }) {
    const playlists = getPlaylist(topic);
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
                <IonList>
                  <IonItemGroup>{playlists}</IonItemGroup>
                </IonList>
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

  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonButton
              expand="full"
              size="large"
              onClick={() => {
                createModal("Building your strength", "strength-training");
              }}
            >
              Building your strength
            </IonButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton
              expand="full"
              size="large"
              onClick={() => {
                createModal("Improving your endurance", "endurance-training");
              }}
            >
              Improving your endurance
            </IonButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton
              expand="full"
              size="large"
              onClick={() => {
                createModal("Improving your mobility", "neuro-mobility");
              }}
            >
              Improving your mobility
            </IonButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton
              expand="full"
              size="large"
              onClick={() => {
                createModal("Experiments", "experiment");
              }}
            >
              Experiments
            </IonButton>
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
        body={<ModuleSubscriptionModal topic={modalTopic} />}
      />
    </>
  );
}

export default addControllersProp(SubscribeToModule);
