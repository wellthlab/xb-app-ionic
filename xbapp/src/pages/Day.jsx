import React, { Component, useState } from "react";
import {
  IonContent,
  IonPage,
  IonModal,
  IonButton,
  IonGrid,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import XBHeader from "../components/XBHeader";

import {
  checkmarkCircleOutline,
  closeCircleOutline,
  arrowForwardOutline,
  calendarClearOutline,
} from "ionicons/icons";

import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { addControllersProp } from "../model/controllers";

import "./Day.css";

const autoBindReact = require("auto-bind/react");

const Day = ({ match, teams, account, controllers }) => {
  var gid = match.params.id; // Group ID comes from route
  var daynumber = match.params.day; // So does day number

  const history = useHistory();

  var group = false;
  for (var g of teams.teams) {
    // Find the group in the store
    if (g._id == gid) {
      group = g;
    }
  }

  // Load team data if required; mostly useful during development
  controllers.LOAD_TEAMS_IF_REQD();

  if (group === false) {
    return <IonPage>Group not found, is state loaded?</IonPage>;
  }

  var exp = group.experiment.info;
  var entries = group.responses.own;

  entries = group.entries; // These are the responses, processed day by day

  // Summarise the reponses
  var rows = [];
  var total = 0;
  var questionnaired = false;

  for (var day of entries) {
    if (day.day == daynumber) break;
  }

  var total = day.minutes;

  var icon_done = checkmarkCircleOutline;
  var icon_missing = closeCircleOutline;
  var icon_go = arrowForwardOutline;

  var taskrows = [];

  var sbtn = "";
  if (typeof day.responseTypes.strength == "undefined") {
    taskrows.push(
      <IonItem
        color="danger"
        routerLink={"/group/" + group._id + "/" + daynumber + "/add/strength"}
        detail={false}
      >
        <IonIcon icon={icon_missing} slot="start" />
        Daily Strength Exercise
        <IonIcon icon={icon_go} slot="end" />
      </IonItem>
    );
  } else {
    taskrows.push(
      <IonItem
        color="success"
        routerLink={"/group/" + group._id + "/" + daynumber + "/add/strength"}
        detail={false}
      >
        <IonIcon icon={icon_done} slot="start" />
        Daily Strength Exercise
      </IonItem>
    );
  }

  taskrows.push(
    <IonItem
      color={total > 0 ? "success" : "danger"}
      routerLink={"/group/" + group._id + "/" + daynumber + "/add/minutes"}
      detail={false}
    >
      <IonIcon slot="start" icon={total > 0 ? icon_done : icon_missing} />
      {total} minutes logged
      <IonIcon slot="end" icon={icon_go} />
    </IonItem>
  );

  var qbtn = "";
  if (typeof day.responseTypes.questionnaire == "undefined") {
    taskrows.push(
      <IonItem
        color="danger"
        routerLink={
          "/group/" + group._id + "/" + daynumber + "/add/questionnaire"
        }
        detail={false}
      >
        <IonIcon icon={icon_missing} slot="start" />
        Daily Review
        <IonIcon icon={icon_go} slot="end" />
      </IonItem>
    );
  } else {
    taskrows.push(
      <IonItem
        color="success"
        routerLink={
          "/group/" + group._id + "/" + daynumber + "/add/questionnaire"
        }
        detail={false}
      >
        <IonIcon icon={icon_done} slot="start" />
        Daily Review
      </IonItem>
    );
  }

  return (
    <IonPage>
      <XBHeader title={group.name + ": Day " + daynumber}></XBHeader>
      <IonContent>
        <IonList className="tasklist">
          <IonItem>
            <IonIcon icon={calendarClearOutline} slot="start" />{" "}
            <strong>Day {daynumber}</strong> &nbsp; &nbsp; {day.date}
          </IonItem>
          {taskrows}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default connect((state, ownProps) => {
  return {
    account: state.account,
    teams: state.teams,
  };
}, {})(addControllersProp(Day));
