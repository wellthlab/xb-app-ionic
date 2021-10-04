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
import XBHeader from "../../components/XBHeader";
import Enroller from "../../components/boxes/Enroller";
import GroupInfo from "../../components/boxes/GroupInfo";
import "./Move.scss";
import { connect } from "react-redux";
import WithXBSlice from "../../components/util/WithXBSlice";
import { addControllersProp } from "../../model/controllers";

const MovePage = (props) => {
  // Ask the user to enrol in a move experiment; or show current experiment info
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
