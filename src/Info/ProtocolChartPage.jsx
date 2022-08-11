import React, { Component, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  IonContent,
  IonPage,
  IonItemDivider,
  IonButton,
  IonItem,
  IonTitle,
} from "@ionic/react";
import XBHeader from "../util/XBHeader";

import { connect } from "react-redux";

const ProtocolChartPage = ({}) => {


  return (
    <IonPage>
      <XBHeader title="The Protocol"></XBHeader>
      <IonContent id="about" fullscreen>
        <IonTitle>Understanding the Protocol</IonTitle>
        <p>Have a look at the following image below to understand how we use MOVEs, REPs, SETs, SUPERSETs, and BLOCKS:</p>
        <img src="assets/protocol.png" alt="heart chart" style={{maxWidth: "95%", maxHeight: "95vh", margin: "auto"}}/>
      <p>Image source: Michael Shaw</p>
      </IonContent>
    </IonPage>
  );
};

export default ProtocolChartPage;
 