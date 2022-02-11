import React, { useState, useEffect } from "react";
import { IonGrid, IonProgressBar, IonRow, IonCol, IonItem } from "@ionic/react";

/**
 * Tracks the total movement minutes for a user
 * TODO: update hardcoded values of seconds and minutes
 */
function TotalTimer(props) {
  const [seconds, setSeconds] = useState(30);
  const [minutes, setMinutes] = useState(2);
  const team = props.team;

  let totalElapsed = minutes + seconds / 60;
  let totalExpected = props.totalMinutes;
  let progress = totalElapsed / totalExpected;

  console.log("totalExpected", totalExpected);

  return (
    <>
      <IonProgressBar value={progress}></IonProgressBar>
      <IonItem>
        <h1>
          {minutes > 9 ? minutes : "0" + minutes}:
          {seconds > 9 ? seconds : "0" + seconds}
          &nbsp; minutes elapsed
        </h1>
      </IonItem>
    </>
  );
}

export default TotalTimer;
