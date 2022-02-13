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

import inputFactory from './inputFactory';

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

    const {input, desc} = inputFactory(type, group, daynumber, save);

    var exp = group.experiment.info;
    var entries = group.user_responses;

    content = input;
  }


  return (
    <IonPage>
      <XBHeader title={"Day " + daynumber}></XBHeader>
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
