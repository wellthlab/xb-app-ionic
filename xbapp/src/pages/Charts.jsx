import React, { useState, useEffect, Component } from "react";
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
const autoBindReact = require("auto-bind/react");

class GroupCharts extends Component {
  state = { showAlert: "false" };
  constructor(props) {
    super(props);
    autoBindReact(this); // Binds 'this' to this object in all methods
    this.refresh();
  }

  render() {
    const { showAlert } = this.state;
    const setState = (state) => this.setState(state);

    function toggleAlert() {
      setState({ showAlert: showAlert == "false" });
    }

    var gid = this.props.match.params.id; // Group ID comes from route
    var group = false;
    for (var g of this.props.teams.teams) {
      // Find the group in the store
      if (g._id == gid) {
        group = g;
      }
    }
    var c;
    if (this.props.teams.fetching || !this.props.teams.loaded) {
      c = <ion-spinner name="crescent" />;
    } else {
      c = (
        <>
          <GenericAlert
            showAlert={showAlert == "true"}
            toggleAlert={toggleAlert}
            message={
              "The chart displays 2 sets of data: the number of minutes you ran everyday, and your mood compared to the day before. The number of minutes starts from 0, whereas the mood begins from -2 (feeling a lot worse than the previous day) up to 2 (feeling a lot better than the previous day). You can notice the development of the bars to observe whether you feel better when running each day. If you tap on a bar, you will be able to see more information on that particular day."
            }
          />
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
          <a
            href="javascript:void(0)"
            style={{ textAlign: "center", margin: "0 0 0 0" }}
            onClick={() => {
              setState({ showAlert: "true" });
            }}
          >
            How do I interpret the bar chart?
          </a>
        </>
      );
    }

    return (
      <IonPage>
        <XBHeader title={group.name}></XBHeader>
        <IonContent>{c}</IonContent>
      </IonPage>
    );
  }
  refresh() {
    this.props.controllers.LOAD_TEAMS();
  }
}

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
