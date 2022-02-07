import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonTitle } from "@ionic/react";
import "./RecordMovement.scss";
import { connect } from "react-redux";
import XBHeader from "../util/XBHeader";

function RecordMovement(props) {
  return (
    <IonPage>
      <XBHeader title="Add Movement"></XBHeader>
      <IonContent fullscreen>
        <br></br>
        <IonTitle>Today you will</IonTitle>
      </IonContent>
    </IonPage>
  );
}

export default connect((state, ownProps) => {
  return {
    account: state.account,
    teams: state.teams,
    boxes: state.boxes,
  };
}, {})(RecordMovement);
