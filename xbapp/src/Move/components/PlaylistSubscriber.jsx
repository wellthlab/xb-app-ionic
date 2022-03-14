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
} from "@ionic/react";
import { connect } from "react-redux";

import { addControllersProp } from "../../util_model/controllers";

import GenericModal from "../../Info/components/GenericModal";

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

  function toggleModal() {
    setShowModal(!showModal);
  }

  function createModal(title, topic) {
    toggleModal();
    setModalTitle(title);
    setModalTopic(topic);
  }

  // Update the userModules object for stuff which is ticked or been unticked
  // for the given topic
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
          return (
            <IonItem>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonLabel>{module.name}</IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonToggle
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
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>{module.desc}</IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          );
        })
    );
  }

  function ModuleSubscriptionModal({ topic }) {
    const playlists = getPlaylist(topic);
    return (
      <>
        <IonList>
          <IonItemGroup>{playlists}</IonItemGroup>
        </IonList>

        <IonButton
          expand="full"
          onClick={() => {
            subscribeUser();
          }}
        >
          Update Playlists
        </IonButton>
      </>
    );
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
                createModal("Increasing your strength", "endurance-training");
              }}
            >
              Increasing your endurance
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
            <IonButton expand="full" size="large" onClick={() => {}}>
              Experiments
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>

      <GenericModal
        showModal={showModal}
        toggleModal={toggleModal}
        title={modalTitle}
        message={<ModuleSubscriptionModal topic={modalTopic} />}
        hideCloseButton={true}
      />
    </>
  );
}

export default connect(
  (state, ownProps) => {
    return {};
  },
  {
    pure: false,
  }
)(addControllersProp(SubscribeToModule));
