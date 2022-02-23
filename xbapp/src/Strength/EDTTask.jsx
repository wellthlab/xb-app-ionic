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
 *  EDT task - includes the ability to change moves to different variations
 *
 */
function EDTSet({ task, groupId, day, week, onSubmit }) {
  let moves = localStorage.getItem("blocks-week-" + week + "-set");
  if (!moves) {
    return (
      <>
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol style={{ textAlign: "center" }}>
                  You don't have any exercises set for this week
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonRouterLink
                    routerLink={
                      "/box/move/" +
                      groupId +
                      "/" +
                      day +
                      "/add/strength-setter"
                    }
                  >
                    <IonButton expand={"full"}>SET EXERCISES</IonButton>
                  </IonRouterLink>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </>
    );
  }

  moves = JSON.parse(moves)[task.strengthBlock];
  let exercisesInBlock = Object.keys(moves);
  let moveA = moves[exercisesInBlock[0]];
  let moveB = moves[exercisesInBlock[1]];

  return (
    <>
      <TimerEDT
        exercises={[moveA, moveB]}
        block={task.strengthBlock}
        onSubmit={onSubmit}
        mins={7}
        secs={0}
      />
      {/* <IonRow>
        <IonCol>
          <IonButton expand={"full"} onClick={changeExercises}>
            Change your moves
          </IonButton>
        </IonCol>
      </IonRow> */}
    </>
  );
}

export default EDTSet;
