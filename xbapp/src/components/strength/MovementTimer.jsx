import React, { useState, useEffect } from "react";
import { IonButton, IonItem, IonInput, IonTitle } from "@ionic/react";

import { connect } from "react-redux";
import CountDown from "../user_input/CountDown";
import MovementInfoCard from "./MovementInfoCard";
import SetCounter from "./SetCounter";

import { moves, getMove } from "./MovementPicker";
import "./MovementTimer.scss";

/**
 * Time movements
 */
const MovementTimer = ({ exercises, onSetChange, onDone, mins, day }) => {
  if (!mins) var mins = 0;
  if (!secs) var secs = 0;

  return (
    <div id="movementTimer">
      <p style={{ padding: "5px 8px 5px 8px" }}>
        Repeat these two moves. Do FIVE reps of the first exercise, followed by
        FIVE reps of the second, for a total of <strong>{mins} minutes</strong>.
      </p>
      <p style={{ padding: "5px 8px 5px 8px" }}>
        Keep a running count of your reps, using the counters below.
      </p>

      {mins == 0 && secs == 0 ? (
        ""
      ) : (
        <CountDown minutes={mins} timerName={"day-" + day} onFinish={onDone} />
      )}

      {exercises.map((ex, i) => {
        var move = getMove(ex);
        console.log("Get move", ex, move);
        return (
          <MovementInfoCard key={move.id} images={move.images} name={move.name}>
            <SetCounter
              onChange={(sets) => {
                onSetChange(move.id, sets);
              }}
            />
          </MovementInfoCard>
        );
      })}
    </div>
  );
};

export default MovementTimer;
