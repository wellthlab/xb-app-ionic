import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonItem,
  IonInput,
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

  return (
    <div id="movementTimer">

      {mins == 0 && secs == 0 ? (
        ""
      ) : (
        <CountDown minutes={mins} timerName={"day-" + day} onFinish={onDone} />
      )}

      <IonGrid>
        <IonRow>
          {Object.entries(exercises).map(([type, exercise]) => {
          return (<IonCol>
          <MovementInfoCard
            accordion={true}
            titleSize={"small"}
            key={exercise}
            images={exercise.images}
            name={exercise.name}
          ></MovementInfoCard>
        </IonCol>)
        })}
        </IonRow>
      </IonGrid>
      <SetCounter
        onChange={(reps) => {
          onSetChange(exercises, block, reps);
        }}
      />
    </div>
  );
};

export default MovementTimer;
