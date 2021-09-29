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
import CountDown from "../instruments/CountDown";
import MovementInfoCard from "./MovementInfoCard";
import SetCounter from "./SetCounter";

import { moves, getMove } from "./MovementPicker";
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
      <p style={{ padding: "5px 8px 5px 8px" }}>
        FIVE reps of each exercise is a SET. Do one set for the first exercise,
        followed by one set of the second, and then repeat, for a total of{" "}
        <strong>{mins} minutes</strong>.
      </p>
      {/* <p style={{ padding: "5px 8px 5px 8px" }}>
        Keep a running count of your sets and reps, using the counters below.
      </p> */}

      {mins == 0 && secs == 0 ? (
        ""
      ) : (
        <CountDown minutes={mins} timerName={"day-" + day} onFinish={onDone} />
      )}

      <IonGrid>
        <IonRow>
          <IonCol>
            <MovementInfoCard
              accordion={true}
              titleSize={"small"}
              key={getMove(exercises[0]) + "0"}
              images={getMove(exercises[0]).images}
              name={getMove(exercises[0]).name}
            ></MovementInfoCard>
          </IonCol>
          <IonCol>
            <MovementInfoCard
              accordion={true}
              titleSize={"small"}
              key={getMove(exercises[1]) + "1"}
              images={getMove(exercises[1]).images}
              name={getMove(exercises[1]).name}
            ></MovementInfoCard>
          </IonCol>
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
