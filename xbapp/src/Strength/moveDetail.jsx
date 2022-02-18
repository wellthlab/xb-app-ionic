import React, { useState } from "react";

import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
} from "@ionic/react";
import XBHeader from "../util/XBHeader";
import SetCounter from "./SetCounter";
import { getMove } from "../DEPRECATED/components/OLDMovementPicker";
import { useHistory } from "react-router";
import MovementInfoCard from "./MovementInfoCard";

/**
 * Detailed stuff
 * TODO: this should probably be somewhere else, so we can record reps and sets
 */
function MoveDetail(props) {
  let history = useHistory();
  let move = getMove(props.match.params.name);

  return (
    <>
      <XBHeader title={move.name} />
      <IonContent>
        <IonCard>
          <MovementInfoCard
            titleSize={"normal"}
            key={move.id}
            images={move.images}
            text={move.description}
          />
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Track your super set!</IonCardTitle>
            <IonCardSubtitle>
              Track your progress here, just increment the rep counter after
              each repetition. Remember, each set is made up of five reps.
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <SetCounter sets={0} showReps={true}></SetCounter>
          </IonCardContent>
        </IonCard>
        <IonButton
          expand="block"
          onClick={() => {
            history.goBack();
          }}
        >
          Back To Activity
        </IonButton>
      </IonContent>
    </>
  );
}

export default MoveDetail;
