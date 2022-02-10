import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonIcon,
  IonCol,
  IonGrid,
  IonRow,
  IonInput,
  IonItem,
} from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import { connect } from "react-redux";

import "./MovementTimer.css";
import XBHeader from "../util/XBHeader";
import CountDown from "./components/CountDown";
import TotalTimer from "./components/TotalTimer";
import ManualTime from "./components/ManualTime";
import { addControllersProp } from "../util_model/controllers";

/**
 *  Display a timer for the current exercise.
 *
 */
function MovementTimer(props) {
  let [paused, setPaused] = useState(false);
  let [manualEntry, setManualEntry] = useState(false);

  const activeExercise = "sit ups";
  const countdownTime = "7";

  const team = props.team;
  const day = team.experiment.day;

  useEffect(() => {
    let minutes = team.entries[day - 1].minutes;
    console.log("minutes", minutes);
  }, [team.entries, day]);

  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol>
            <h3>
              Do {activeExercise.toUpperCase()} for {countdownTime} minutes
            </h3>
          </IonCol>
        </IonRow>
        <IonRow>
          {!manualEntry ? (
            <IonCol>
              <CountDown
                minutes={countdownTime}
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
                <IonIcon icon={addCircleOutline}></IonIcon> &nbsp; Add these
                minutes manually
              </IonButton>
            </div>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <TotalTimer />
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
}

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
)(addControllersProp(MovementTimer));
