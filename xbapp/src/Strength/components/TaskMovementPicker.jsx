import { useState } from "react";
import { IonButton, IonRow, IonCol, IonCard } from "@ionic/react";

import "../../MovementPuzzlePicker/BlockPlanner.css";
import BlockPlanner from "../../MovementPuzzlePicker/BlockPlanner";
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
  updateExercises,
  saveExercises,
}) {
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
          explorer={false}
          onSubmit={() => {}}
          moveTypes={moveTypes}
          week={week}
          exercises={exercises}
          updateExercises={updateExercises}
          setContent={setMovePickerContent}
        />
        <IonCard>
          <IonRow>
            <IonCol>
              <IonButton
                expand="block"
                onClick={() => {
                  saveExercises();
                  toggleView();
                }}
              >
                Done
              </IonButton>
            </IonCol>
          </IonRow>
        </IonCard>
      </>
    );
  }

  return <>{content}</>;
}

export default TaskMovementPicker;
