import React, { Component, useState } from "react";
import {
  IonContent,
  IonPage,
  IonModal,
  IonButton,
  IonBackButton,
} from "@ionic/react";
import XBHeader from "../util/XBHeader";

import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import { addControllersProp } from "../util_model/controllers";

import MinuteEntry from "../UserInput/MinuteEntry";
import Questionnaire from "../UserInput/Questionnaire";
import StrengthWizard from "../Strength/StrengthWizard";
import StrengthExercisePicker from "../DEPRECATED/StrengthExercisePicker";
import Assessment from "../Strength/Assessment";
import Note from "../UserInput/Note";
import WorkAssessment from "../UserInput/WorkAssessment";
import BlockPlanner from "../MovementPuzzlePicker/BlockPlanner";
const autoBindReact = require("auto-bind/react");

const AddResponse = (props) => {
  var gid = props.match.params.id; // Group ID comes from route
  var daynumber = props.match.params.day; // So does day number
  var type = props.match.params.type;

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
    var link = "/box/move/";
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
            <IonButton routerLink={link}>Back to your Move Box</IonButton>
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
        var week = Math.floor((daynumber - 1) / 7);

        input = (
          <StrengthWizard
            location={props.location}
            countdownID={daynumber + "-" + gid}
            week={week}
            onSubmit={save}
          />
        );
        break;

      case "strength-setter":
        var week = Math.floor((daynumber - 1) / 7);

        input = ( //TODO: define save function for blockplanner
          <BlockPlanner
            location={props.location}
            onSubmit={save}
            explorer={false}
            week={week}
          />
        );

        // input = (
        //   <StrengthWizard
        //     countdownID={daynumber + "-" + gid}
        //     week={week}
        //     onSubmit={save}
        //   />
        // );
        break;

      case "strength-explorer":
        var week = -1;

        input = ( //TODO: define save function for blockplanner
          <BlockPlanner
            location={props.location}
            onSubmit={save}
            explorer={true}
            week={week}
            day={daynumber}
          />
        );

        // input = (
        //   <StrengthExercisePicker
        //     countdownID={daynumber + "-" + gid}
        //     week={week}
        //     onSubmit={save}
        //   />
        // );
        break;

        case "work-assessment":
        input = <WorkAssessment onSubmit={save} />;
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
    case "strength-setter":
      typedesc = "Daily Strength Session";
      break;
    case "strength-explorer":
      typedesc = "Daily Strength Session";
      break;
    case "note":
      typedesc = "Note";
      break;
    case "assessment":
      typedesc = "Strength Assessment";
      break;
      case "work-assessment":
        typedesc = "Work Engagement Questionnaire";
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
