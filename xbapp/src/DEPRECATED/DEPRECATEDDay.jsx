import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonItemDivider, IonCard } from "@ionic/react";
import XBHeader from "../util/XBHeader";

import { connect } from "react-redux";
import MinutesChart from "../Boxes/components/minutesChart";
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
  arrowForwardOutline,
} from "ionicons/icons";
import Instructions from "../Boxes/components/Instructions";

import { addControllersProp } from "../util_model/controllers";

import DailyJournal from "../Journal/DailyJournal";

const Day = ({ match, teams, controllers, account }) => {
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();
  function toggleAlert() {
    setShowAlert(!showAlert);
  }

  // Load team data if required; mostly useful during development
  controllers.LOAD_TEAMS_IF_REQD();

  // Wait for teams to be loaded
  if (teams.fetching) {
    return "";
  }

  /**
   * Look up the group
   */
  var gid = match.params.id; // Group ID comes from route
  var group = false;
  for (var g of teams.teams) {
    // Find the group in the store
    if (g._id == gid) {
      group = g;
    }
  }

  // Check the active day is set, and that group is found etc.
  if (group === false) {
    return <IonPage>Nope :(</IonPage>;
  }

  /**
   * Render header info
   * Plus daily journal
   */
  var day = group.experiment.day;
  var daydesc =
    day == 0
      ? "Starts tomorrow"
      : day < 0
      ? "Starts in " + Math.abs(day) + " days"
      : day > group.experiment.info.duration
      ? "Finished"
      : "Today is day " + day;

  var members =
    group.users.length > 1 ? group.users.length + " members" : "Just You";

  return (
    <IonPage id="weekInfo">
      <XBHeader title={group.name}></XBHeader>
      <IonContent>
        <DailyJournal todayNumber={day} entries={group.entries} group={group} />
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
)(addControllersProp(Day));
