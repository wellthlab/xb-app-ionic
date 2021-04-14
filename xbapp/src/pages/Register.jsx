import React from "react";
import { connect } from "react-redux";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Register from "../components/Register";
import "./Register.css";

const TabReg = (account) => {
  return (
    <IonPage id="register">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large"></IonTitle>
          </IonToolbar>
        </IonHeader>

        <Register />
      </IonContent>
    </IonPage>
  );
};

// Return the component, wrapped up so that it connects to the global state from Redux
export default connect(
  (state, ownProps) => {
    // A function to map parts of the global state (from the App's wrapper <Provider>)
    // into props for the wrapped component (which will be TabAccount)
    return {
      account: state.account,
    };
  },
  {
    // A map full of action creators
    pure: false,
  }
)(TabReg);
