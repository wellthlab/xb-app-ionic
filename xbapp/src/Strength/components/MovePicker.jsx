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
import { addControllersProp } from "../../util_model/controllers";

function MovePicker({
  moduleId,
  week,
  userProfile,
  moveTypes,
  toggleView,
  controllers,
}) {
  const [movePickerContent, setMovePickerContent] = useState(undefined);

  async function saveMovesToProfile() {
    if (window.history.state.exercisesSet) {
      const storageKey = week === -1 ? "blocks-week-0" : "blocks-week-" + week;
      const moves = JSON.parse(window.localStorage.getItem(storageKey));
      await controllers.SET_CHOSEN_MOVEMENTS({ moves: moves });
    }
  }

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

export default addControllersProp(MovePicker);
