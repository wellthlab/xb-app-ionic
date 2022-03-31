import { useState } from "react";
import {
  IonButton,
  IonText,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonItem,
  IonRouterLink,
  IonRow,
  IonSpinner,
} from "@ionic/react";
import { connect } from "react-redux";

import TimerEDT from "./components/EDTMovementTimer";
import { getMove } from "../DEPRECATED/components/OLDMovementPicker";
import MovePicker from "./components/MovePicker";
import { addControllersProp } from "../util_model/controllers";

/**
 *  EDT task - includes the ability to change moves`
 *
 */
function EDTSet({ task, team, userProfile, day, week, onSubmit, controllers }) {
  const [showMovePicker, setShowMovePicker] = useState(false);
  function toggleShowMovePicker() {
    setShowMovePicker(!showMovePicker);
  }

  let content;

  if (showMovePicker) {
    content = (
      <>
        <MovePicker
          moduleId={task.moduleId}
          week={team.experiment.week}
          userProfile={userProfile}
          moveTypes={task.moveTypes}
          toggleView={toggleShowMovePicker}
        />
      </>
    );
  } else if (!task.chosenMoves || Object.keys(task.chosenMoves).length === 0) {
    content = (
      <>
        <IonGrid>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonText>You do not have any moves set</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonButton onClick={toggleShowMovePicker}>Choose Moves</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </>
    );
  } else {
    content = (
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

  return <>{content}</>;
}

export default EDTSet;
