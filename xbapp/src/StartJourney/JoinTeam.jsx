import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonSpinner,
  IonText,
} from "@ionic/react";
import XBHeader from "../util/XBHeader";

import { addControllersProp } from "../util_model/controllers";
import { connect } from "react-redux";
const autoBindReact = require("auto-bind/react");

/**
 * Join an existing group
 * TODO: Rename this to be less ambiguous
 */
const ExperimentInGroup = (props) => {
  const [number, setNumber] = useState();
  const [joining, setJoining] = useState(false);

  props.controllers.LOAD_TEAMS_IF_REQD();

  if (!props.teams.loaded) {
    return <IonSpinner className="center-spin" name="crescent" />;
  }

  async function addTeam(code) {
    setJoining(true);
    //console.log(code);
    await props.controllers.JOIN_TEAM(code);
  }

  async function removeFromTeam(code) {
    setJoining(true);
    await props.controllers.LEAVE_TEAM(code);
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
          <IonText color="success">Great, you've joined a new team!</IonText>
        </div>
        <div className="centering">
          <IonButton onClick={() => (window.location.href = "/box/move")}>
            Go to your Team
          </IonButton>
        </div>
      </>
    );
  } else {
    // Otherwise show the entry interface
    var btn, err;
    if (props.teams.joining) {
      btn = <IonSpinner name="crescent" className="center-spin" />;
    } else if (typeof number !== "undefined" && number.length == 6) {
      btn = (
        <IonButton
          onClick={() => {
            if (props.teams.teams.bybox["move"]) {
              removeFromTeam(props.teams.teams.bybox["move"][0].code);
            }
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
            value={number}
            type="text"
            style={{
              fontSize: "1.4em",
              fontWeight: "bold",
              marginBottom: "30px",
            }}
            placeholder="Enter your Team Code"
            maxlength={6}
            onIonChange={(e) => {
              setNumber(e.detail.value.toUpperCase());
            }}
          />
        </div>
        {err}
        <div className="centering">{btn}</div>
      </>
    );
  }

  const headerDisplayStyle = props.teams.teams.bybox["move"] ? "" : "none";
  const divPaddingStyle = props.teams.teams.bybox["move"]
    ? ""
    : "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)";

  return (
    <IonPage>
      <XBHeader
        title="Join a Team"
        style={{
          display: headerDisplayStyle,
        }}
      />
      <IonContent style={{ paddingTop: "30px" }}>
        <div style={{ padding: divPaddingStyle }}>{content}</div>
      </IonContent>
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
