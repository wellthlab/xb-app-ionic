import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonTitle,
  IonDatetime,
  IonHeader,
  IonButton,
  IonIcon,
  IonCol,
  IonGrid,
  IonRow,
} from "@ionic/react";

import { caretForwardOutline, addCircleOutline } from "ionicons/icons";

import { connect } from "react-redux";
import { addControllersProp } from "../util_model/controllers";

import XBHeader from "../util/XBHeader";
import CountDown from "./components/CountDown";

function MovementTimer(props) {
  let [paused, setPaused] = useState(false);

  function getNextTask() {}

  const nextButton = ( // button to go to the next task, only visible from timer paused
    <IonGrid>
      <IonCol size="12" class="ion-text-center">
        <div>
          <IonButton>
            Done <IonIcon icon={caretForwardOutline}></IonIcon>
          </IonButton>
        </div>
      </IonCol>
    </IonGrid>
  );

  // const isActive = localStorage.getItem("CountDowncountActive");

  // useEffect(() => {
  //   isActive ? setPaused(false) : setPaused(true);
  //   console.log("CountDowncountActive", isActive, "paused", paused);
  // }, [isActive, paused]);

  return (
    <>
      <XBHeader title="Record Movement"></XBHeader>
      <h3>Do EXERCISE for TIME minutes.</h3>
      <CountDown
        minutes="7"
        active="false"
        onPause={() => {
          setPaused(true);
        }}
      ></CountDown>

      <IonGrid>
        <IonRow>
          <IonCol style={{ padding: "0px" }}>
            <div className="time0">
              <IonButton expand="full">
                <IonIcon icon={addCircleOutline}></IonIcon> Add these minutes
                manually
              </IonButton>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
}

export default MovementTimer;
