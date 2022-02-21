import { useState } from "react";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonRouterLink,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from "@ionic/react";

import MovementInfoCard from "./MovementInfoCard";
import TaskQuestions from "./Questions";
import SetCounter from "./SetCounter";
import { getMove } from "../DEPRECATED/components/OLDMovementPicker";
import MovementTimer from "./MovementTimer";

function MoveTask({ task, onSubmit }) {
  const [sets, setSets] = useState(null);
  let moveA = getMove(task.moves[0]);
  let moveB = getMove(task.moves[1]);

  return (
    <>
      <MovementTimer
        exercises={[moveA, moveB]}
        block={0} // needs changing to be the actual block?
        onSubmit={onSubmit}
        mins={1}
        secs={0}
      />
    </>
  );
}

export default MoveTask;
