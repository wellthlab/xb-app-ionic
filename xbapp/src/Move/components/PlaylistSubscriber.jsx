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

  // TODO: this is a mess, and should be refactored.........
  // Update the userModules object for stuff which is ticked or been unticked
  // for the given topic
  function updateModules(checked, moduleName, moduleId, topic) {
    // create the an array for the topic if it doesn't exist
    if (!userModules[topic]) {
      userModules[topic] = [];
    }
    // If adding this module for the first time then create it, otherwise just
    // modify the "active" field
    if (!userModules[topic].find((el) => el.id === moduleId)) {
      // push modules to list
      userModules[topic] = [
        ...userModules[topic],
        { id: moduleId, name: moduleName, active: checked, stage: 0 },
      ];
    } else {
      let stage;
      userModules[topic] = userModules[topic].filter((el) => {
        stage = el.stage;
        return el.id !== moduleId;
      });
      userModules[topic] = [
        ...userModules[topic],
        { id: moduleId, name: moduleName, active: checked, stage: stage },
      ];
    }
  }

  // Create a of available modules for a given topic. Displays the name and a
  // description of the module, and a toggle to subscribe
  function getPlaylist(topic) {
    // get all modules for a topic
    const modulesForTopic = availableModules.filter(
      (module) => module.topic === topic
    );
    // Create item with name, desc and toggle
    return modulesForTopic.map((module) => {
      if (!userModules[topic]) {
        return null;
      }
      // first check to see if the user is already subscribed
      let checked;
      const index = userModules[topic].findIndex((el) => el.id === module._id);
      if (index < 0) {
        checked = false;
      } else {
        checked = userModules[topic][index].active;
      }

      // const checked = userModules[topic].includes(module._id);
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
    });
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
