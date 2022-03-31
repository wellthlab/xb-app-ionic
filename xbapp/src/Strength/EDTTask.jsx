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

function getDefaultMove(type) {
  switch (type) {
    // Bilateral
    case "bilateral lower push":
      return "fullsquat";
    case "bilateral lower pull":
      return "wallrdlprep";
    case "bilateral upper push":
      return "flatpushup";
    case "bilateral upper pull":
      return "chinup";
    // Unilateral
    // case "unilateral lower push":
    //   return "lunge";
    // case "unilateral lower pull":
    //   return "singlelegromaniandeadlift";
    // case "unilateral upper push":
    //   return "archerpushup";
    // case "unilateral upper pull":
    //   return "flatpushup";
    // Isometric
    case "isolateral lower push":
      return "vsit";
    case "isolateral lower pull":
      return "lsit";
    case "isolateral upper push":
      return "sideplank";
    case "isolateral upper pull":
      return "onearmpull";
    default:
      return "fullsquat";
  }
}

//

/**
 *  EDT task - includes the ability to change moves
 *
 */
function EDTSet({ task, onSubmit }) {
  // TODO: go back to movement picker when ready
  let moveA = getMove(getDefaultMove(task.edtMoves[0]));
  let moveB = getMove(getDefaultMove(task.edtMoves[1]));

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
