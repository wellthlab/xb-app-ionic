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

const HeartRateChartPage = ({}) => {


  return (
    <IonPage>
      <XBHeader title="Heart Rate Chart"></XBHeader>
      <IonContent id="about" fullscreen>
        <IonTitle>Understanding Heart Rate numbers</IonTitle>
        {/* <p>A resting heart rate is defined as a pulse that is taken when you are calm, sitting or lying down, and the best time to measure a resting heart rate is in the morning before you leave the bed. Generally speaking, a lower heart rate functions more effectively and efficiently.</p> */}
        <p>Have a look at the normal heart rate chart below:</p>
        <img src="assets/heartRateChart.png" alt="heart chart" style={{maxWidth: "95%", maxHeight: "95vh", margin: "auto"}}/>
      <p>Source: https://www.newhealthadvisor.org/</p>
      </IonContent>
    </IonPage>
  );
};

export default HeartRateChartPage;
 