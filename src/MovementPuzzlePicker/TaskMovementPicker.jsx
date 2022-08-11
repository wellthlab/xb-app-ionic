import { useState } from "react";
import { IonButton, IonCard, IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { useHistory } from "react-router";

import "./BlockPlanner.css";
import BlockPlanner from "./BlockPlanner";

/**
 * Controls the top level logic and rendering for movement picking whilst in
 * a EDT task.
 *
 * @param moduleId
 * @param week
 * @param userProfile
 * @param moveTypes
 * @param toggleView  -- a function to control toggling the picking view
 * @param controllers
 */
function TaskMovementPicker({
  week,
  moveTypes,
  toggleView,
  exercises,
  updateExercise,
  saveExercises,
  explorer,
  showBackButton = true,
}) {
  const history = useHistory();
  const [movePickerContent, setMovePickerContent] = useState(undefined);

  let content;

  // If the movement picker variable has been set, then display it.
  // This variable is set in <BlockPlanner /> -> <Block />.
  // It is done this way because of how things are structured later down the
  // line making it difficult to do it in a more elegant way. So here is some
  // technical debt, to be solved later.
  if (movePickerContent) {
    content = <>{movePickerContent}</>;
  } else {
    content = (
      <>
        <BlockPlanner
          explorer={explorer}
          onSubmit={() => {}}
          moveTypes={moveTypes}
          week={week}
          exercises={exercises}
          updateExercise={updateExercise}
          setContent={setMovePickerContent}
        />
        {showBackButton ? (
          <IonCard color="transparent">
            <IonButton
              expand="block"
              onClick={() => {
                if (saveExercises) {
                  saveExercises();
                }
                if (explorer) {
                  history.goBack();
                } else {
                  toggleView();
                }
              }}
            >
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonCard>
        ) : (
          ""
        )}
      </>
    );
  }

  return <>{content}</>;
}

export default TaskMovementPicker;
