import React, { Component, useState } from "react";
import {
  IonContent,
  IonPage,
  IonModal,
  IonButton,
  IonBackButton,
} from "@ionic/react";
import XBHeader from "../components/XBHeader";

import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import { addControllersProp } from "../model/controllers";

import MinuteEntry from "../components/MinuteEntry";
import Questionnaire from "../components/Questionnaire";
import StrengthWizard from "../components/strength/StrengthWizard"

const autoBindReact = require("auto-bind/react");

const AddResponse = ({ match, teams, account, controllers, history }) => {
  var gid = match.params.id; // Group ID comes from route
  var daynumber = match.params.day; // So does day number
  var type = match.params.type;

  //const history = useHistory();

  const [saved, setSaved] = useState(false);

  const [group, setGroup] = useState(false);

  // Load team data if required; mostly useful during development
  controllers.LOAD_TEAMS_IF_REQD();

  if (group === false) {
    for (var g of teams.teams) {
      // Find the group in the store
      if (g._id == gid) {
        setGroup(g);
      }
    }

    return <IonPage>Group not found</IonPage>;
  }

  async function save(res) {
    setSaved("saving");
    res.type = type;
    res.day = daynumber;
    await controllers.ADD_RESPONSE(gid, res);
    setSaved("saved");
  }

  function reset() {
    history.goBack();
    setSaved("unsaved");
    // TODO: This is a bit of a hack; better way to completely reset this component ready for next use?
  }

  var content;
  if (saved == "saved") {
    var link = "/group/" + gid + "/" + daynumber;
    content = (
      <>
        <div className="done">
          <h1 className="centering">
            <ion-icon name="checkmark-circle-outline"></ion-icon> Great!
          </h1>
          <p className="centering">
            You've added a response. Keep adding responses to track your
            progress.
          </p>
          <p className="centering">
            <IonButton onClick={reset}>Back to Responses</IonButton>
          </p>
        </div>
      </>
    );
  } else if (saved == "saving") {
    content = <></>;
  } else {
    var input;
    // time key is used to re-create rather than re-use elements on subsequent uses
    var time = Date.now();
    switch (type) {
      case "minutes":
        input = <MinuteEntry key={time} group={group} onSubmit={save} />;
        break;

      case "questionnaire":
        input = <Questionnaire key={time} onSubmit={save} />;
        break;

      case "strength":
        var week = Math.floor(daynumber / 7);

        // Determine required minutes based on week
        // TODO: Check what these should be!
        var mins;
        if(week <= 1) {
          mins = 7;
          //reps = 1;
        } else if (week == 2) {
          mins = 10;
          //reps = 2;
        } else if (week == 3) {
          mins = 12;
          //reps = 2;
        } else if (week >= 4) {
          mins = 15;
          //reps = 3;
        }

        input = <StrengthWizard mins={mins} week={week} />;
        break;

      default:
        input = <p>Unknown Response Type</p>;
        break;
    }

    var exp = group.experiment.info;
    var entries = group.user_responses;

    content = input;
  }

  var typedesc;
  switch (type) {
    case "minutes":
      typedesc = "Add Movement Minutes";
      break;
    case "questionnaire":
      typedesc = "Daily Questionnaire";
      break;
    case "strength":
      typedesc = "Daily Strength Session";
      break;
  }

  return (
    <IonPage>
      <XBHeader title={ typedesc + ": Day " + daynumber}></XBHeader>
      <IonContent>{content}</IonContent>
    </IonPage>
  );
};

export default connect(
  (state, ownProps) => {
    return {
      account: state.account,
      teams: state.teams,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(AddResponse));
