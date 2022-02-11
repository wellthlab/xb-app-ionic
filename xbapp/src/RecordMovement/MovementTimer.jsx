import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonIcon,
  IonCol,
  IonGrid,
  IonRow,
  IonItem,
  IonLabel,
  IonFooter,
} from "@ionic/react";
import { addCircleOutline, informationCircleOutline } from "ionicons/icons";
import { connect } from "react-redux";

// import "./MovementTimer.css";
import CountDown from "./components/CountDown";
import TotalTimer from "./components/TotalTimer";
import ManualTime from "./components/ManualEntry";

/**
 *  Display a timer for the current exercise.
 *  - prop.task
 *  - totalMinutes : total minutes expected for the day
 */
function MovementTimer(props) {
  let [paused, setPaused] = useState(false);
  let [manualEntry, setManualEntry] = useState(false);

  if (!props.task) {
    return <>No task selected</>;
  }

  return (
    <>
      {/* Exercise and for how long header -- press for details */}
      <IonItem
        detailIcon={informationCircleOutline}
        detail={true}
        color={"tertiary"}
        href={"/"}
      >
        <IonLabel>Do {props.task.desc.toUpperCase()}</IonLabel>
      </IonItem>

      {/* Timer and buttons for manual entry of minutes */}

      <IonGrid>
        <IonRow>
          {!manualEntry ? (
            <IonCol>
              <CountDown
                minutes={props.task.mins}
                active="false"
                onPause={() => {
                  setPaused(true);
                }}
              ></CountDown>
            </IonCol>
          ) : (
            <ManualTime></ManualTime>
          )}
        </IonRow>
        <IonRow>
          <IonCol style={{ padding: "0px" }}>
            <div className="time0">
              <IonButton
                onClick={() => {
                  setManualEntry(!manualEntry);
                }}
                expand="full"
              >
                <IonIcon icon={addCircleOutline}></IonIcon> &nbsp;
                {manualEntry ? "BACK TO TIMER" : "ENTER MINUTES MANUALLY"}
              </IonButton>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>

      {/* Total time exercising today
      TODO: needs to be at the bottom of the screen*/}
      <IonFooter>
        <TotalTimer totalMinutes={props.totalMinutes} />
      </IonFooter>
    </>
  );
}

export default MovementTimer;
