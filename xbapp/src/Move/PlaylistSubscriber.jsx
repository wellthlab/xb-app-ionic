import {
  IonContent,
  IonLabel,
  IonItem,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import { addControllersProp } from "../util_model/controllers";

import XBHeader from "../util/XBHeader";

function SubscribeToModule(props) {
  props.controllers.SET_USER_PROFILE_IF_REQD();
  props.controllers.LOAD_MODULES_IF_REQD();
  let history = useHistory();

  // Check if the user profile and available modules are loaded first

  if (!props.userProfile.userProfile)
    return <IonSpinner name="crescent" className="center-spin" />;
  if (!props.modules.modules)
    return <IonSpinner name="crescent" className="center-spin" />;

  //

  let modules = props.modules.modules;
  let profile = props.userProfile.userProfile;
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
    history.goBack();
  }

  // Update the userModules object for stuff which is ticked or been unticked
  // for the given topic
  function updateModules(playlistsTicked, topic) {
    userModules[topic] = playlistsTicked;
  }

  // Function for getting each module for a given topic into an IonSelectOption
  function getPlaylist(topic) {
    return modules
      .filter((module) => {
        return module.topic === topic;
      })
      .map((module) => {
        return (
          <IonSelectOption value={module._id}>{module.name}</IonSelectOption>
        );
      });
  }

  // Dropdown component which allows multiple selections
  function SubscriptionPicker({ title, topic }) {
    let playlists = getPlaylist(topic);
    return (
      <IonItem>
        <IonLabel>{title}</IonLabel>
        <IonSelect
          value={userModules[topic]}
          multiple={true}
          onIonChange={(e) => {
            updateModules(e.detail.value, topic);
          }}
        >
          {playlists}
        </IonSelect>
      </IonItem>
    );
  }

  return (
    <IonPage>
      <XBHeader title="Activity Modules" />
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Choose your activity modules</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <SubscriptionPicker
              title="Building your strength"
              topic="strength-training"
            />

            <SubscriptionPicker
              title="Increasing your endurance"
              topic="endurance-training"
            />

            <SubscriptionPicker title="Neuro mobility" topic="neuro-mobility" />

            <IonButton expand="full" onClick={subscribeUser}>
              Save
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}

export default connect(
  (state, ownProps) => {
    return {
      modules: state.modules,
      userProfile: state.userProfile,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(SubscribeToModule));
