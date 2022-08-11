import React from "react";
import { connect } from "react-redux";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ResetPassword from "./components/ResetPassword";
import "./ResetPassword.scss";

const TabResetPassword = (props) => {
  const query = props.location.search;
  return (
    <IonPage id="reset-password">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Reset Password</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large"></IonTitle>
          </IonToolbar>
        </IonHeader>
        <ResetPassword query={query} />
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
)(TabResetPassword);
