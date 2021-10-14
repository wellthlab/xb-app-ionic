import React, { Component, useState } from "react";
import {
  IonContent,
  IonPage,
  IonModal,
  IonButton,
  IonBackButton,
} from "@ionic/react";
import XBHeader from "../../components/XBHeader";

import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import { addControllersProp } from "../../model/controllers";

import MinuteEntry from "../../components/user_input/MinuteEntry";
import Questionnaire from "../../components/user_input/Questionnaire";
import StrengthWizard from "../../components/strength/StrengthWizard";
import StrengthExercisePicker from "../../components/strength/StrengthExercisePicker";
import Assessment from "../../components/strength/Assessment";
import Note from "../../components/user_input/Note";
import BlockPlanner from "../BlockPlanner";
const autoBindReact = require("auto-bind/react");

const AddResponse = (props) => {
  var gid = props.match.params.id; // Group ID comes from route
  var daynumber = props.match.params.day; // So does day number
  var type = props.match.params.type;

  console.log("TRIALLLL ", props.location);
  //const history = useHistory();

  const [saved, setSaved] = useState(false);
  const [group, setGroup] = useState(false);

  // Load team data if required; mostly useful during development
  props.controllers.LOAD_TEAMS_IF_REQD();

  if (group === false) {
    for (var g of props.teams.teams) {
      // Find the group in the store
      if (g._id == gid) {
        setGroup(g);
      }
    }

    return <IonPage>Group not found</IonPage>;
  }

  async function save(res) {
    setSaved("saving");

    if (!Array.isArray(res)) {
      res.type = type; // We can only set type for single-response types; otherwise, provider needs to do it
      res = [res];
    }

    for (var r of res) {
      r.day = daynumber;
      console.log("Add response", r);
      await props.controllers.ADD_RESPONSE(gid, r);
    }

    setSaved("saved");
  }

  function reset() {
    props.history.goBack();
    setSaved("unsaved");
    // TODO: This is a bit of a hack; better way to completely reset this component ready for next use?
  }

  var content;
  if (saved == "saved") {
    var link = "/box/move/" + gid + "/journal";
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
            <IonButton routerLink={link}>Back to Experiment</IonButton>
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
        var week = Math.floor((daynumber - 1) / 7) + 1;


        input = (
          <StrengthWizard
            countdownID={daynumber + "-" + gid}
            week={week}
            onSubmit={save}
          />
        );
        break;

        case "strength-setter":
          var week = Math.floor((daynumber - 1) / 7) + 1;
  
          input = ( //TODO: define save function for blockplanner
            <BlockPlanner location = {props.location} onSubmit={save} explorer={false}/>
          );
  
          // input = (
          //   <StrengthWizard
          //     countdownID={daynumber + "-" + gid}
          //     week={week}
          //     onSubmit={save}
          //   />
          // );
          break;

      case "strength-explore":
        var week = Math.floor((daynumber - 1) / 7) + 1;

        input = ( //TODO: define save function for blockplanner
          <BlockPlanner location = {props.location} onSubmit={save} explorer={true}/>
        );

        // input = (
        //   <StrengthExercisePicker
        //     countdownID={daynumber + "-" + gid}
        //     week={week}
        //     onSubmit={save}
        //   />
        // );
        break;

      case "assessment":
        input = <Assessment onSubmit={save} />;
        break;

      case "note":
        input = <Note onSubmit={save} />;
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
    case "strength-exercise":
      typedesc = "Daily Strength Session";
      break;
    case "note":
      typedesc = "Note";
      break;
    case "assessment":
      typedesc = "Strength Assessment";
      break;
  }

  return (
    <IonPage>
      <XBHeader title={typedesc + ": Day " + daynumber}></XBHeader>
      <IonContent>{content}</IonContent>
    </IonPage>
  );
};

export default connect(
  (state, ownProps) => {
    return {
      account: state.account,
      teams: state.teams,
      experiments: state.experiments,
      boxes: state.boxes,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(AddResponse));
