import { useState } from "react";

import TimerEDT from "./components/MovementTimer";
import { getMove } from "../DEPRECATED/components/OLDMovementPicker";

function EDTSet({ task, onSubmit }) {
  const [sets, setSets] = useState(null);
  let moveA = getMove(task.moves[0]);
  let moveB = getMove(task.moves[1]);

  return (
    <>
      <TimerEDT
        exercises={[moveA, moveB]}
        block={0} // needs changing to be the actual block?
        onSubmit={onSubmit}
        mins={7}
        secs={0}
      />
    </>
  );
}

export default EDTSet;
