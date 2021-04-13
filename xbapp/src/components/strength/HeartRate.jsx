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
import "./MinuteEntry.scss";
import { connect } from "react-redux";
import Timer from "./Timer";
import mobiscroll from "@mobiscroll/react-lite";
import "@mobiscroll/react-lite/dist/css/mobiscroll.min.css";
import "./ExperimentList.css";

const MinuteEntry = (props) => {
  const [rate, setRate] = useState(null);

  var seconds = 30; // Number of seconds to count for

  function save() {
    if (props.onSubmit) {
      props.onSubmit(rate);
    }
  }

  function reset() {}

  function updateBeats(beats) {
    save(beats * (60 / seconds));
  }

  // TODO
  return (
    <>
      <img src="assets/icons/heart.png" alt="Heartrate" />
      <p>Find your pulse, and count your heartbeats for {seconds} seconds.</p>
      <p>How many beats did you count?</p>
      <IonInput type="number" placeholder="Beats" />
    </>
  );
};

export default MinuteEntry;
