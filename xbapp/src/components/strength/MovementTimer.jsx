import React, { useState, useEffect } from "react";
import { IonButton, IonItem, IonInput, IonTitle } from "@ionic/react";

import { connect } from "react-redux";
import Countdown from "../CountDown";

/**
 * Time movements
 */
const MovementTimer = ({ exercises, onChange }) => {
  const [rate, setRate] = useState(null);

  console.log("Timer", exercises, typeof exercises, onChange);

  var seconds = 30; // Number of seconds to count for

  function save() {
    if (onChange) {
      onChange(rate);
    }
  }

  // TODO
  return (
    <>
      {exercises.map((ex, i) => {
        return <>{ex}</>;
      })}

      <p>Do your moves</p>
      <p>Timer Goes Here</p>
    </>
  );
};

export default MovementTimer;
