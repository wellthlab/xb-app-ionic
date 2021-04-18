import React, { useState, useEffect } from "react";
import { IonButton, IonItem, IonInput, IonTitle } from "@ionic/react";

import { connect } from "react-redux";
import CountDown from "../user_input/CountDown";
import MovementInfoCard from "./MovementInfoCard";
import SetCounter from "./SetCounter";

import { moves, getMove } from "./MovementPicker";
import "./MovementTimer.scss";

/**
 * Show exercise, with tips to find the right level
 */
const LevelFinder = ({ exercise }) => {
  var move = getMove(exercise);
  console.log("Get move", exercise, move);
  var card = (
    <MovementInfoCard key={move.id} images={move.images} name={move.name}>
      <p>{move.difficulty ? move.difficulty : ""}</p>
    </MovementInfoCard>
  );

  return (
    <div id="levelFinder">
      <p style={{ padding: "5px 8px 5px 8px" }}>
        It's important to find the right level for your strength moves. You're
        aiming to find a level where you can do TEN reps in a row. If you can do
        more than ten, it's too easy! And if you can't do the full ten, it's too
        hard.
      </p>

      <p style={{ padding: "5px 8px 5px 8px" }}>
        Most exercises have variations that make them easier or harder. Explore
        this move, using the hints below.
      </p>

      {card}
    </div>
  );
};

export default LevelFinder;
