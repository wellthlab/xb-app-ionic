import { useEffect, useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonItem,
  IonRouterLink,
  IonRow,
} from "@ionic/react";

import TimerEDT from "./components/EDTMovementTimer";
import { getMove } from "../DEPRECATED/components/OLDMovementPicker";

/**
 *  EDT task - includes the ability to change moves
 *
 */
function EDTSet({ task, onSubmit }) {
  // TODO: go back to movement picker when ready
  let moveA = getMove(task.edtMoves[0]);
  let moveB = getMove(task.edtMoves[1]);

  return (
    <>
      <TimerEDT
        exercises={[moveA, moveB]}
        block={task.edtBlock}
        onSubmit={onSubmit}
        mins={7}
        secs={0}
      />
    </>
  );
}

export default EDTSet;
