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
  IonCard,
  IonContent,
} from "@ionic/react";

import "../../MovementPuzzlePicker/BlockPlanner.css";
import BlockPlanner from "../../MovementPuzzlePicker/BlockPlanner";

function MovePicker({ moduleId, week, userProfile, moveTypes, toggleView }) {
  const [movePickerContent, setMovePickerContent] = useState(undefined);

  function saveMovesToProfile() {}

  console.log("movePickerContent", movePickerContent);

  return (
    <>
      {movePickerContent ? (
        <>{movePickerContent}</>
      ) : (
        <>
          <BlockPlanner
            explorer={false}
            onSubmit={() => {}}
            moveTypes={moveTypes}
            week={week}
            setContent={setMovePickerContent}
          />
          <IonCard>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="block"
                  onClick={() => {
                    saveMovesToProfile();
                    toggleView();
                  }}
                >
                  Done
                </IonButton>
              </IonCol>
            </IonRow>
          </IonCard>
        </>
      )}
    </>
  );
}

export default MovePicker;
