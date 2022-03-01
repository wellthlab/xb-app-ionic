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

/**
 *  EDT task - includes the ability to change moves
 *
 */
function EDTSet({ task, groupId, day, week, onSubmit }) {
  // let moves = localStorage.getItem("blocks-week-" + week + "-set");
  // if (!moves) {
  //   return (
  //     <>
  //       <IonCard>
  //         <IonCardContent>
  //           <IonGrid>
  //             <IonRow>
  //               <IonCol style={{ textAlign: "center" }}>
  //                 You don't have any exercises set for this week
  //               </IonCol>
  //             </IonRow>
  //             <IonRow>
  //               <IonCol>
  //                 <IonRouterLink
  //                   routerLink={
  //                     "/box/move/" +
  //                     groupId +
  //                     "/" +
  //                     day +
  //                     "/add/strength-setter"
  //                   }
  //                 >
  //                   <IonButton expand={"full"}>Set Exercises</IonButton>
  //                 </IonRouterLink>
  //               </IonCol>
  //             </IonRow>
  //           </IonGrid>
  //         </IonCardContent>
  //       </IonCard>
  //     </>
  //   );
  // }

  // moves = JSON.parse(moves)[task.strengthBlock];
  // let exercisesInBlock = Object.keys(moves);
  // let moveA = moves[exercisesInBlock[0]];
  // let moveB = moves[exercisesInBlock[1]];

  // TODO: go back to movement picker when ready
  let moveA = getMove("fullsquat");
  let moveB = getMove("flatpushup");

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
