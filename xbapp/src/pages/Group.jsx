import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonItemDivider, IonCard } from "@ionic/react";
import XBHeader from "../components/XBHeader";

import { connect } from "react-redux";
import MinutesChart from "../components/minutesChart";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  IonIcon,
  IonItem,
  IonChip,
  IonTitle,
  IonLabel,
  IonButton,
  IonList,
} from "@ionic/react";
import {
  peopleOutline,
  todayOutline,
  add,
  barChart,
  checkmarkCircleOutline,
  closeCircleOutline,
} from "ionicons/icons";
import Instructions from "../components/Instructions";
import GenericAlert from "../components/GenericAlert";

import "./Group.scss";

import { addControllersProp } from "../model/controllers";

const Group = ({ match, teams, controllers, account }) => {
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();
  function toggleAlert() {
    setShowAlert(!showAlert);
  }

  // Load team data if required; mostly useful during development
  controllers.LOAD_TEAMS_IF_REQD();

  useEffect(() => {
    // Load team responses
    controllers.GET_TEAM_RESPONSES(group._id);
  }, [match.params.id]);

  var gid = match.params.id; // Group ID comes from route
  var group = false;
  for (var g of teams.teams) {
    // Find the group in the store
    if (g._id == gid) {
      group = g;
    }
  }

  if (group === false) {
    return <IonPage>Nope :(</IonPage>;
  }

  var exp = group.experiment.info;
  var entries = group.entries;

  // Generate daily summaries
  var days = [];
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var date = entry.date;

    var icon_done = checkmarkCircleOutline;
    var icon_missing = closeCircleOutline;

    console.log(entry);

    // TODO: Don't hard code this; take from experiment
    var qreq = [
      { type: "strength", desc: "Daily Strength Exercise" },
      { type: "minutes", desc: "Movement Minutes" },
      { type: "questionnaire", desc: "Daily Review" },
    ];

    var day = entry.day;
    if (day == 1 || day == 22 || day == 36) {
      qreq.push({ type: "assessment", desc: "Strength Assessment" });
    }

    var statusList = qreq.map((type) => {
      var done = typeof entry.responseTypes[type.type] !== "undefined";

      console.log(type.type, done);

      return (
        <IonItem color={done ? "success" : "danger"} key={type.type}>
          <IonIcon slot="start" icon={done ? icon_done : icon_missing} />
          {type.desc}
        </IonItem>
      );
    });

    days.push(
      <IonCard key={i} routerLink={"/group/" + group._id + "/" + entry.day}>
        <ion-card-header>
          <ion-card-subtitle>Day {entry.day}</ion-card-subtitle>
          <ion-card-title>{date}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <IonList>{statusList}</IonList>
        </ion-card-content>
      </IonCard>
    );
  }

  days.reverse();

  var day = group.experiment.day;
  var daydesc =
    day == 0
      ? "Starts tomorrow"
      : day < 0
      ? "Starts in " + Math.abs(day) + " days"
      : day > group.experiment.info.duration
      ? "Finished"
      : "Day " + day;

  var members =
    group.users.length > 1 ? group.users.length + " members" : "Just You";

  return (
    <IonPage id="weekInfo">
      <XBHeader title={group.name}></XBHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <h2 slot="start">{exp.title}</h2>
          </IonItem>

          <IonItem>
            <Instructions html={group.experiment.current_stage.instructions} />
          </IonItem>

          <IonItem color="primary">
            <IonIcon icon={peopleOutline} slot="start" /> {members}
            <span slot="end">
              Team Code: <strong>{group.code}</strong>
            </span>
          </IonItem>

          <Link to={"/group/" + group._id + "/charts"}>
            <IonItem
              color="tertiary"
              style={{ cursor: "pointer" }}
              detail={true}
            >
              <IonIcon icon={barChart} slot="start" />
              View Charts
            </IonItem>
          </Link>

          <IonItem
            color={
              day < 0
                ? "warning"
                : day > group.experiment.info.duration
                ? "error"
                : "primary"
            }
          >
            <IonIcon icon={todayOutline} slot="start" /> {daydesc}
          </IonItem>
        </IonList>

        {days}
      </IonContent>
    </IonPage>
  );
};

export default connect(
  (state, ownProps) => {
    return {
      account: state.account,
      teams: state.teams,
      boxes: state.boxes,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(Group));
