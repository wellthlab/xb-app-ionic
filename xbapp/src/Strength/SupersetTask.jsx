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

  function updateSets(exercises, block, count) {
    var copy = {};
    Object.assign(copy, sets); //there are actually reps here!!!
    var stringOfExercises = "";
    Object.entries(exercises).map(([type, exercise]) => {
      stringOfExercises = stringOfExercises + "+" + exercise.id;
    });
    stringOfExercises = stringOfExercises.substring(1);
    copy[stringOfExercises + "-" + block] = count;
    setSets(copy);
  }

  return (
    <>
      <MovementTimer
        exercises={[moveA, moveB]}
        block={0} // needs changing to be the actual block?
        onSetChange={updateSets} // using what george did
        onSubmit={onSubmit}
        mins={7}
        secs={0}
      />
    </>
  );
}

export default MoveTask;

// Old design
// {/* Move A */}
// {/* <IonRow>
//   <IonCol>
//     <IonRouterLink routerLink={"/movedetail/" + task.moves[0]}>
//       <MovementInfoCard
//         titleSize={"normal"}
//         key={moveA.id}
//         images={moveA.images}
//         name={moveA.name}
//       />
//     </IonRouterLink>
//     <SetCounter sets={0} showCounter={true} onSubmit={onSubmit} />
//   </IonCol> */}
// {/* move B */}
// {/* <IonCol>
//     <IonRouterLink routerLink={"/movedetail/" + task.moves[1]}>
//       <MovementInfoCard
//         titleSize={"normal"}
//         key={moveB.id}
//         images={moveB.images}
//         name={moveB.name}
//       />
//     </IonRouterLink>
//     <SetCounter sets={0} showCounter={true} onSubmit={onSubmit} />
//   </IonCol>
// </IonRow> */}

// {/* Button to change their moves if they want */}
// {/* <IonRow>
// <IonCol>
//   <IonButton expand="full">Change your moves</IonButton>
// </IonCol>
// </IonRow> */}

// {/* <IonGrid>
//   <IonRow>
//     <IonCol>
//       <TaskQuestions onSubmit={onSubmit} />
//     </IonCol>
//   </IonRow>
// </IonGrid> */}
