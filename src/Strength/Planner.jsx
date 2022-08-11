import React, { useState } from "react";
import {
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonCardContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import Instructions from "../Boxes/components/Instructions";

/**
 * Props:
 *   onSubmit - a callback for when the plan is submitted
 *   group - the team the person belongs to
 */
const Planner = ({ onSubmit, group }) => {
  const [target, setTarget] = useState(false);

  function confirm() {
    const plan = {};

    // TODO: Generate the plan
    plan.effectiveWeek = 1; // Everyone is in week 1 to begin with!
    plan.effectiveWeek = group.experiment.week;
    plan.target = parseInt(target);

    onSubmit([
      {
        type: "s22plan",
        plan: plan,
      },
    ]);
  }

  const path = group.s22path.path;
  const title = group.experiment.current_stage.title;
  const message = group.experiment.current_stage.minutesInstruction[path];
  let complete = true && target !== false;

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{title}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            <IonItem>
              <Instructions html={message} />
            </IonItem>

            <IonItem>
              <IonLabel>Daily Target</IonLabel>
              <IonSelect
                onIonChange={(e) => {
                  setTarget(e.detail.value);
                }}
              >
                <IonSelectOption>7 minutes</IonSelectOption>
                <IonSelectOption>14 minutes</IonSelectOption>
                <IonSelectOption>21 minutes</IonSelectOption>
                <IonSelectOption>28 minutes</IonSelectOption>
                <IonSelectOption>35 minutes</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>
          {complete ? (
            <IonButton expand="full" onClick={confirm}>
              Save Plan
            </IonButton>
          ) : (
            ""
          )}
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default Planner;
