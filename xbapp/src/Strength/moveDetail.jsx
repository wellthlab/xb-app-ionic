import React, { useState } from "react";
import {
  IonContent,
  IonCard,
  IonButton,
  IonCardContent,
  IonText,
} from "@ionic/react";

import XBHeader from "../util/XBHeader";
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
      {/* The padding wont work for some reason? */}
      <IonContent style={{ "--padding-bottom": "85px" }}>
        <IonCard>
          <MovementInfoCard
            titleSize={"normal"}
            key={move.id}
            images={move.images}
            text={move.description + " " + move.warning}
          />
        </IonCard>

        <IonCard>
          <IonCardContent>
            <IonText>
              <h1>Too easy for you?</h1>
            </IonText>
            {move.difficulty}
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
