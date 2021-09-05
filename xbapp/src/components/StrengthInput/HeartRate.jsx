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

//we have the experiment/group ID, we have the day number to require update and we have the account
//=> can we update the day?
//need to handle the click of "submit" in both cases: when they use the timer or when they use an input field
const MinuteEntry = (props) => {
  const [rate, setRate] = useState(null);

  function save() {
    if (props.onSubmit) {
      props.onSubmit(rate);
    }
  }

  function reset() {}

  function updateBeats(beats) {
    setRate(beats * 2);
  }

  // TODO
  return (
    <>
      <img src="assets/icons/heart.png" alt="Heartrate" />
      <IonInput type="number" placeholder="Beats" />
    </>
  );
};

export default MinuteEntry;
