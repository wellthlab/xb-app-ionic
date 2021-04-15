import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonItemDivider, IonCard } from "@ionic/react";
import XBHeader from "../components/XBHeader";

import { connect } from "react-redux";
import MinutesChart from "../components/minutesChart";

import {
  IonIcon,
  IonItem,
  IonChip,
  IonTitle,
  IonLabel,
  IonButton,
  IonList,
} from "@ionic/react";
import { peopleOutline, todayOutline, add } from "ionicons/icons";
import Instructions from "../components/Instructions";
import GenericAlert from "../components/GenericAlert";

import { addControllersProp } from "../model/controllers";

const GroupCharts = ({ match, teams, controllers, account }) => {
  const [showAlert, setShowAlert] = useState(false);
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

  return (
    <IonPage>
      <XBHeader title={group.name}></XBHeader>
      <IonContent>
        {group.users.length == 1 ? (
          <>
            <MinutesChart group={group} individual={true} />
          </>
        ) : (
          <>
            <MinutesChart group={group} individual={false} />
          </>
        )}
        <IonItemDivider></IonItemDivider>
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
)(addControllersProp(GroupCharts));
