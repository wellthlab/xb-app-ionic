import React, { useState } from "react";
import { IonContent, IonPage, IonInput, IonButton } from "@ionic/react";
import XBHeader from "../../components/XBHeader";

import { addControllersProp } from "../../model/controllers";
import { connect } from "react-redux";
const autoBindReact = require("auto-bind/react");

/**
 * Join an existing group
 * TODO: Rename this to be less ambiguous
 */
const ExperimentInGroup = (props) => {
  const [number, setNumber] = useState();
  const [joining, setJoining] = useState(false);

  function addTeam(code) {
    setJoining(true);
    //console.log(code);
    props.controllers.JOIN_TEAM(code);
  }

  var content;

  // Detect completed joins and redirect
  if (
    joining &&
    props.teams.joining === false &&
    props.teams.join_err === false
  ) {
    content = (
      <>
        <div className="centering">
          <ion-text color="success">Great, you've joined a new team!</ion-text>
        </div>
        <div className="centering">
          <IonButton routerLink="/box/move">Go to your Team</IonButton>
        </div>
      </>
    );
  } else {
    // Otherwise show the entry interfae
    var btn, err;
    if (props.teams.joining) {
      btn = <ion-spinner name="crescent" />;
    } else if (typeof number !== "undefined" && number.length == 6) {
      btn = (
        <IonButton
          onClick={() => {
            addTeam(number);
          }}
        >
          Join Team
        </IonButton>
      );
    } else {
      btn = <></>;
    }

    if (props.teams.join_err !== false) {
      err = (
        <div className="centering">
          <ion-text color="danger">{props.teams.join_err}</ion-text>
        </div>
      );
    } else {
      err = <></>;
    }

    content = (
      <>
        <p style={{ textAlign: "center", margin: "20px 0 20px 0" }}>
          To join a team, you need to know the Team Code.
          <br />
          Someone in the team can tell you what it is.
        </p>
        <div className="centering">
          <IonInput
            type="text"
            style={{
              fontSize: "1.4em",
              fontWeight: "bold",
              marginBottom: "30px",
            }}
            placeholder="Enter your Team Code"
            onIonChange={(e) => {
              console.log(e);
              setNumber(e.detail.value);
            }}
          ></IonInput>
        </div>
        {err}
        <div className="centering">{btn}</div>
      </>
    );
  }

  return (
    <IonPage>
      <XBHeader title="Join a Team"></XBHeader>
      <IonContent style={{ paddingTop: "30px" }}>{content}</IonContent>
    </IonPage>
  );
};
export default connect(
  (state, ownProps) => {
    return {
      teams: state.teams,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(ExperimentInGroup));
