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
import XBHeader from "../util/XBHeader";

/**
 *  Display a timer for the current exercise.
 *  - prop.task
 *  - totalMinutes : total minutes expected for the day
 */
function MovementTimer(props) {
  let [paused, setPaused] = useState(false);
  let [manualEntry, setManualEntry] = useState(false);

  let currentTask = JSON.parse(localStorage.getItem("currentTask"));
  let totalMinutes = parseInt(localStorage.getItem("totalMinutes"));
  let groupId = props.match.params.id;
  let task = props.match.params.task;

  return (
    <>
      <XBHeader title="Record Movement"></XBHeader>
      {/* Exercise and for how long header -- press for details */}
      <IonItem
        detailIcon={informationCircleOutline}
        detail={true}
        color={"secondary"}
        // href={"/"}  // todo: link to info page about task
      >
        <IonLabel>{currentTask.desc.toUpperCase()}</IonLabel>
      </IonItem>

      {/* Timer and buttons for manual entry of minutes */}

      <IonGrid>
        <IonRow>
          {!manualEntry ? (
            <IonCol>
              {/* entry from timer */}
              <CountDown
                id={groupId}
                task={currentTask}
                minutes={currentTask.mins}
                active="false"
                onPause={() => {
                  setPaused(true);
                }}
              ></CountDown>
            </IonCol>
          ) : (
            <ManualTime id={groupId} task={task}></ManualTime> // manual entry
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
                {/* if we're in manual entry, show "back to timer" */}
                {manualEntry ? "Back to timer" : "Enter minutes manually"}
              </IonButton>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>

      {/* Total time exercising today
      TODO: needs to be at the bottom of the screen. smile */}
      {/* <IonFooter>
        <TotalTimer totalMinutes={totalMinutes} />
      </IonFooter> */}
    </>
  );
}

export default MovementTimer;
