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

  const modules = props.modules;
  const profile = props.userProfile;
  let userModules = {
    ...profile.modules,
  };
  let modulesUpdated = false;

  console.log("userModules", userModules);

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
    if (modulesUpdated) {
      subscribeUser();
      modulesUpdated = false;
    }
  }

  function createModal(title, topic) {
    toggleModal();
    setModalTitle(title);
    setModalTopic(topic);
  }

  // Update the userModules object for stuff which is ticked or been unticked
  // for the given topic
  function updateModules(checked, moduleId, topic) {
    if (checked) {
      if (!userModules[topic]) {
        userModules[topic] = [moduleId];
      } else {
        userModules[topic] = [...userModules[topic], moduleId];
      }
    } else {
      userModules[topic] = userModules[topic].filter((id) => id !== moduleId);
    }
    modulesUpdated = true;
  }

  // Create a list of given playlists for a given topic, displaying the name of
  // the playlist, a toggle to subscribe and the description of the playlist
  function getPlaylist(topic) {
    const topicModules = modules.filter((module) => module.topic === topic);
    return topicModules.map((module) => {
      let checked;
      if (userModules[topic]) {
        checked = userModules[topic].includes(module._id);
      } else {
        checked = false;
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
                    updateModules(e.detail.checked, module._id, topic);
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
