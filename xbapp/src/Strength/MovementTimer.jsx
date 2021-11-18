import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonItem,
  IonLabel,
  IonRow,
  IonGrid,
  IonCol,
} from "@ionic/react";

import { connect } from "react-redux";
import CountDown from "../Instruments/CountDown";
import MovementInfoCard from "./MovementInfoCard";
import SetCounter from "./SetCounter";

import { moves, getMove } from "../DEPRECATED/components/OLDMovementPicker";
import "./MovementTimer.scss";
import { AlternateEmail } from "@material-ui/icons";

/**
 * Time movements
 */
const MovementTimer = ({
  exercises,
  block,
  onSetChange,
  onDone,
  mins,
  day,
}) => {
  if (!mins) var mins = 0;
  if (!secs) var secs = 0;

  const [moveAlternation, setMoveAlternation] = React.useState([null, null]);
  const [numberOfSets, setNumberOfSets] = React.useState(0);
  const [showReps, setShowReps] = React.useState(false);

  function alternate(key) {
    if (moveAlternation[0] == null){
      var updated = [false, false];
      updated[key] = true;
      setMoveAlternation(updated);
    } else {
      var updated = [!moveAlternation[0], !moveAlternation[1]];
      setMoveAlternation(updated);
      setNumberOfSets(numberOfSets++);
    }
  }


  return (
    <div id="movementTimer">

      {mins == 0 && secs == 0 ? (
        ""
      ) : (
        <CountDown minutes={mins} timerName={"day-" + day} onFinish={() => {onDone(); setShowReps(true);}} />
      )}

      <IonGrid>
        <IonRow>
          {Object.entries(exercises).map(([type, exercise], key) => {
          return (<IonCol style={{border: moveAlternation[key] == null ? "": moveAlternation[key] == true ? "" : ""}} onClick={() => alternate(key)}>
          <MovementInfoCard
            accordion={false}
            titleSize={"small"}
            key={exercise}
            images={exercise.images}
            name={exercise.name}
          ></MovementInfoCard>
        </IonCol>)
        })}
        </IonRow>
        {showReps == false ? <IonRow>
          <IonLabel>Added: {numberOfSets} sets</IonLabel>
        </IonRow> : <></>}
      </IonGrid>
        {showReps ? <SetCounter
        sets={numberOfSets}
        onChange={(reps) => {
          onSetChange(exercises, block, reps);
        }}
      /> : <></>}
      
    </div>
  );
};

export default MovementTimer;
