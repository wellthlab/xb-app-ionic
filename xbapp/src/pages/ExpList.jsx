import React, { Component } from "react";
import { withRouter } from "react-router";
import { IonContent, IonPage } from "@ionic/react";
import XBHeader from "../components/XBHeader";
import "./ExpList.css";

import ExperimentList from "../components/ExperimentList";

import { addControllersProp } from "../model/controllers";

import { connect } from "react-redux";
const autoBindReact = require("auto-bind/react");

class ExpList extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this); // Binds 'this' to this object in all methods
    this.refresh();
  }

  render() {
    //console.log("Render ExpList", this.props);

    var c;
    if (this.props.teams.fetching) {
      c = <ion-spinner name="crescent" />;
    } else {
      // Redirect to create exp. page if no experiments exist
      if (this.props.teams.teams.length == 0) {
        c = <></>;
        this.props.history.replace("/start/");
      }
      // If only one experiment, go straight to it
      // This prevents access to the add experiment button, so needs some thought before enabling
      else if (false && this.props.teams.teams.length == 1) {
        c = <></>;
        this.props.history.replace("/group/" + this.props.teams.teams[0]._id);
      } else {
        c = <ExperimentList teams={this.props.teams.teams} />;
      }
    }

    return (
      <IonPage>
        <XBHeader title="Experiments"></XBHeader>
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
      teams: state.teams,
      experiments: state.experiments,
      boxes: state.boxes,
    };
  },
  {
    // Actions to include as props
  }
)(addControllersProp(withRouter(ExpList)));
