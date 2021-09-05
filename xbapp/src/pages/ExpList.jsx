import React, { Component } from "react";
import { withRouter } from "react-router";
import {
  IonContent,
  IonPage,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import XBHeader from "../components/XBHeader";
import WithXBSlice from "../components/util/WithXBSlice";
import "./ExpList.css";

import { add } from "ionicons/icons";

import ExperimentList from "../components/ExperimentList";

import { addControllersProp } from "../model/controllers";

import { connect } from "react-redux";
const autoBindReact = require("auto-bind/react");

class ExpList extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this); // Binds 'this' to this object in all methods
  }

  render() {
    console.log("Teams", this.props.teams.teams);

    return (
      <IonPage>
        <XBHeader title="Experiments"></XBHeader>
        <IonContent>
          <ExperimentList teams={this.props.teams.teams} />
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton routerLink="/start">
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        </IonContent>
      </IonPage>
    );
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
)(
  addControllersProp(
    withRouter(
      WithXBSlice(ExpList, "teams", (props) => {
        props.controllers.LOAD_TEAMS_IF_REQD();
      })
    )
  )
);
