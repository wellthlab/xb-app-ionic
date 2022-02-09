import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonCol,
  IonGrid,
  IonRow,
} from "@ionic/react";

import { addCircleOutline } from "ionicons/icons";

import "./MovementTimer.css";
import XBHeader from "../util/XBHeader";
import CountDown from "./components/CountDown";

/**
 *  Display a timer for the current exercise.
 *
 */
function MovementTimer(props) {
  let [paused, setPaused] = useState(false);

  function getNextTask() {}
  const activeExercise = "exercise";
  const countdownTime = "7";

  return (
    <>
      <IonContent>
        <XBHeader title="Record Movement"></XBHeader>
        <IonGrid>
          <IonRow>
            <IonCol>
              <h3>
                Do {activeExercise.toUpperCase()} for {countdownTime} minutes
              </h3>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <CountDown
                minutes={countdownTime}
                active="false"
                onPause={() => {
                  setPaused(true);
                }}
              ></CountDown>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol style={{ padding: "0px" }}>
              <div className="time0">
                <IonButton expand="full">
                  <IonIcon icon={addCircleOutline}></IonIcon> &nbsp; Add these
                  minutes manually
                </IonButton>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol style={{ position: "absolute", bottom: "100px" }}>
              <h3> CUMULATIVE TIMER GOES HERE </h3>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </>
  );
}

export default MovementTimer;
