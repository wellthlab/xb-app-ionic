import React, { useState, useEffect } from "react";
import { IonGrid, IonProgressBar, IonRow, IonCol, IonItem } from "@ionic/react";

/**
 * Tracks the total movement minutes for a user
 *
 */
function TotalTimer(props) {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const team = props.team;

  let progress = 0.5;

  return (
    <>
      <IonProgressBar value={progress}></IonProgressBar>
      <IonItem>
        <h1>
          {seconds}:{minutes} minutes elapsed today
        </h1>
      </IonItem>
    </>
  );
}

export default TotalTimer;
