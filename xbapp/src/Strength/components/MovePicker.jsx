import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  IonButton,
  IonItem,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonPage,
  IonContent,
} from "@ionic/react";

import "../../MovementPuzzlePicker/BlockPlanner.css";
import BlockPlanner from "../../MovementPuzzlePicker/BlockPlanner";

function MovePicker({ moduleId, week, userProfile, moveTypes, toggleView }) {
  function saveMovesToProfile() {}

  let movesPicked = userProfile.modules[moduleId].edtMoves || [
    "No move",
    "No move",
  ];

  return (
    <>
      <BlockPlanner
        explorer={false}
        onSubmit={() => {}}
        moveTypes={moveTypes}
        week={week}
      />

      <IonRow>
        <IonCol>
          <IonButton onClick={toggleView}>Done</IonButton>
        </IonCol>
      </IonRow>
    </>
  );
}

export default MovePicker;
