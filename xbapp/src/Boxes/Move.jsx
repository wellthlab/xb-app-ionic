import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonItem,
  IonInput,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import XBHeader from "../util/XBHeader";
import Enroller from "./components/Enroller";
import GroupInfo from "./components/GroupInfo";
import "./Move.scss";
import { connect } from "react-redux";
import WithXBSlice from "../util/WithXBSlice";
import { addControllersProp } from "../util_model/controllers";

const MovePage = (props) => {
  // Ask the user to enrol in a move experiment; or show current experiment info
  // React.useEffect(() => {
  //   //whenever the timer is triggered (when the user presses on image)
  //   console.log("UPDATED");
  //   props.controllers.LOAD_TEAMS_IF_REQD();
  // }, []);

  console.log(props.teams.teams);
  if (!props.teams.teams.bybox["move"]) {
    var content = <Enroller boxtype="move" />;
  } else {
    var content = (
      <GroupInfo
        group={props.teams.teams.bybox["move"][0]}
        match={props.match}
      ></GroupInfo>
    );
  }

  return (
    <IonPage>
      <XBHeader title="Move"></XBHeader>
      <IonContent>{content}</IonContent>
    </IonPage>
  );
};

export default connect(
  (state, ownProps) => {
    return {
      teams: state.teams,
      experiments: state.experiments,
    };
  },
  {
    // Actions to include as props
  }
)(
  addControllersProp(
    WithXBSlice(MovePage, "teams", (props) => {
      props.controllers.LOAD_TEAMS_IF_REQD();
    })
  )
);
