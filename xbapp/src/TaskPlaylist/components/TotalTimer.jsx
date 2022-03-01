import React, { useState, useEffect } from "react";
import { IonGrid, IonProgressBar, IonRow, IonCol, IonItem } from "@ionic/react";

/**
 * Tracks the total movement minutes for a user
 * TODO: update hardcoded values of seconds and minutes
 */
function TotalTimer({target, logged}) {

  let progress = logged / target;

  console.log("Total timer", logged, target, progress);

  var tstr = target.toString().padStart(2, '0') + ":00";
  var lstr = Math.floor(logged).toString().padStart(2, '0') + ":" + Math.floor((logged * 60) % 60).toString().padStart(2, '0');

  return (
    <>
      <IonProgressBar value={progress}></IonProgressBar>
      <p>{lstr} of {tstr}</p>
    </>
  );
}

export default TotalTimer;
