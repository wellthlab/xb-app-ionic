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

function SuperSetTask({ task, onSubmit }) {
  let moveA = getMove(task.moves[0]);
  let moveB = getMove(task.moves[1]);

  return (
    <>
      <IonGrid>
        {/* Help text, or similar */}
        <IonRow>
          <IonCol>
            <h3>
              Click a task to learn more about it, including move variations.
            </h3>
          </IonCol>
        </IonRow>
        {/* Move A */}

        <IonRow>
          <IonCol>
            <IonRouterLink routerLink={"/movedetail/" + task.moves[0]}>
              <MovementInfoCard
                titleSize={"normal"}
                key={moveA.id}
                images={moveA.images}
                name={moveA.name}
              />
            </IonRouterLink>
          </IonCol>
          {/* move B */}
          <IonCol>
            {/* click to go to rep counter and info about move */}
            <IonRouterLink routerLink={"/movedetail/" + task.moves[1]}>
              <MovementInfoCard
                titleSize={"normal"}
                key={moveB.id}
                images={moveB.images}
                name={moveB.name}
              />
            </IonRouterLink>
            {/* </IonItem> */}
          </IonCol>
        </IonRow>

        {/* Button to change their moves if they want */}
        {/* <IonRow>
              <IonCol>
                <IonButton expand="full">Change your moves</IonButton>
              </IonCol>
            </IonRow> */}
        {/* Contextual questions */}

        <IonRow>
          <IonCol>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Track your super set!</IonCardTitle>
                <IonCardSubtitle>
                  Track how many sets and reps you managed to do here. Remember,
                  to rest between sets if you need to and that a set is made up
                  of five reps.
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <SetCounter
                  sets={0}
                  showCounter={true}
                  onSubmit={onSubmit}
                ></SetCounter>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol>
            <TaskQuestions onSubmit={onSubmit} />
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
}

export default SuperSetTask;
