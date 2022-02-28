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

import TimerEDT from "./components/MovementTimer";
import { getMove } from "../DEPRECATED/components/OLDMovementPicker";
import BlockPlanner from "../MovementPuzzlePicker/BlockPlanner";

/**
 *  EDT task - includes the ability to change moves
 *
 */
function EDTSet({ task, groupId, day, week, onSubmit }) {
  // moves = JSON.parse(moves)[task.strengthBlock];
  // let exercisesInBlock = Object.keys(moves);
  let moveA = getMove(task.strengthBlock[0]);
  let moveB = getMove(task.strengthBlock[1]);

  return (
    <>
      <TimerEDT
        exercises={[moveA, moveB]}
        block={task.strengthBlock}
        onSubmit={onSubmit}
        mins={7}
        secs={0}
      />
    </>
  );
}

export default EDTSet;
