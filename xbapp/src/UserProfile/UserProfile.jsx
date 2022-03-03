import { useState } from "react";
import { connect } from "react-redux";
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
} from "@ionic/react";

import { addControllersProp } from "../util_model/controllers";

import XBHeader from "../util/XBHeader";

function UserProfile(props) {
  const [prefName, setPrefName] = useState(null);

  function saveProfile() {
    const profile = {
      name: prefName,
    };
    console.log("Saving profile", profile);
    props.controllers.CREATE_USER_PROFILE(profile);
  }

  return (
    <>
      <XBHeader title="User Profile" />
      <IonContent>
        <h1>User Profile</h1>
        <IonItem>
          <IonLabel position="floating">Your preferred name</IonLabel>
          <IonInput
            value={prefName}
            onIonChange={(e) => setPrefName(e.detail.value)}
          ></IonInput>
        </IonItem>

        <IonButton onClick={saveProfile}>Submit</IonButton>
      </IonContent>
    </>
  );
}

export default connect(
  (state, ownProps) => {
    return {
      user: state.user,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(UserProfile));
