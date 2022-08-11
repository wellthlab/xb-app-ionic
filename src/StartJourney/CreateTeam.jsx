import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { checkmarkCircleOutline } from "ionicons/icons";
import XBHeader from "../util/XBHeader";

import { addControllersProp } from "../util_model/controllers";
import { connect } from "react-redux";

import "./CreateTeam.scss";

/**
 * Create a new team experiment
 */
const CreateTeam = (props) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [expid, setExpid] = useState(
    props.match.params.expid ? props.match.params.expid : false
  ); // Defaults to the strength challenge
  const [creating, setCreating] = useState(false); // Track if a create operation has been attempted

  function create(name, desc, expid) {
    setCreating(true);
    // Start date defaults to today
    //var startDate = new Date().toISOString().substring(0, 10);
    // Start date defaults to 1st of nov
    var startDate = new Date();
    props.controllers.CREATE_TEAM(name, desc, expid, startDate);
  }

  async function removeFromTeam(code) {
    setCreating(true);
    await props.controllers.LEAVE_TEAM(code);
  }

  if (expid === false) {
    return <>No expid :(</>;
  }

  var content;

  // Detect completed joins and redirect
  if (
    creating &&
    props.teams.creating === false &&
    props.teams.create_err === false
  ) {
    content = (
      <>
        <div className="done">
          <h1>
            <IonIcon icon={checkmarkCircleOutline} /> Great!
          </h1>
          <p className="centering">
            You've created a new team! Let's get <strong>started</strong>.
          </p>
          <p className="centering">
            <IonButton onClick={() => (window.location.href = "/box/move")}>
              Let's Go!
            </IonButton>
          </p>
        </div>
      </>
    );
  } else {
    // Otherwise show the entry interfae
    var btn, err;
    if (props.teams.creating) {
      btn = <ion-spinner name="crescent" />;
    } else if (name.length > 3) {
      btn = (
        <IonButton
          onClick={() => {
            if (props.teams.teams.bybox["move"]) {
              removeFromTeam(props.teams.teams.bybox["move"][0].code);
            }
            create(name, desc, expid);
          }}
        >
          Create Team
        </IonButton>
      );
    } else {
      btn = <></>;
    }

    if (props.teams.join_err !== false) {
      err = (
        <div className="centering">
          <ion-text color="danger">{props.teams.create_err}</ion-text>
        </div>
      );
    } else {
      err = <></>;
    }

    /**
    <IonInput
      type="text"
      placeholder="Team Description"
      onIonChange={(e) => {
        setDesc(e.detail.value);
      }}
    ></IonInput>
    */

    content = (
      <>
        <p style={{ textAlign: "center", margin: "20px 0 20px 0" }}>
          Choose a name for your team, and optionally enter a description. The
          name must have at least 4 characters.
        </p>
        <div className="centering">
          <IonInput
            type="text"
            placeholder="Team Name"
            onIonChange={(e) => {
              setName(e.detail.value);
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
    <IonPage className="creator">
      <XBHeader title="Create a Team" style={{ display: headerDisplayStyle }} />
      <IonContent>
        <div style={{ padding: divPaddingStyle }}>{content}</div>
      </IonContent>
    </IonPage>
  );
};
export default connect(
  (state, ownProps) => {
    return {
      teams: state.teams,
      account: state.account,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(CreateTeam));
