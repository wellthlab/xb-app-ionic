import { useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { barbellOutline } from "ionicons/icons";

import { addControllersProp } from "../util_model/controllers";
import {
  getDefaultMoves,
  checkMovesCorrect,
  checkIfAllExercisesChosen,
  createEmptyMovementsChosen,
} from "./components/edt/EdtFunctions";
import TimerEDT from "./components/edt/EdtTimer";
import TaskMovementPicker from "../MovementPuzzlePicker/TaskMovementPicker";

/**
 * Render the UI for an EDT set or for picking move variations.
 *
 * @param task
 * @param team
 * @param userProfile
 * @param day
 * @param onSubmit
 * @param controllers
 */
function EdtTask({ task, team, userProfile, onSubmit, controllers }) {
  // We need something stateful to tell react when to display the movement
  // picker and when to display the actual tasks
  const [showMovePicker, setShowMovePicker] = useState(false);
  function toggleShowMovePicker() {
    setShowMovePicker(!showMovePicker);
  }

  const stage = parseInt(userProfile.modules[task.moduleId].stage, 10) + 1 || 1;
  const isSnack = task.module.topic.includes("snack/");
  const playlistWeek = isSnack ? 1 : Math.round(stage % 5);
  const key = `blocks-week-${playlistWeek}`;

  // Set up the exercisesChosen variable, where it will either be taken from
  // the userProfile or the default "Select a Move" messages. These are
  // displayed on the buttons for BlockPlanner
  let movesForPlaylist;

  if (isSnack) {
    movesForPlaylist = getDefaultMoves(task);
  } else if (userProfile.modules[task.moduleId].edtMoves) {
    movesForPlaylist =
      userProfile.modules[task.moduleId].edtMoves[key] ||
      createEmptyMovementsChosen(task);

    movesForPlaylist = checkMovesCorrect(task, movesForPlaylist);
  } else {
    movesForPlaylist = createEmptyMovementsChosen(task);
  }

  const [exercisesChosen, setExercisesChosen] = useState(movesForPlaylist);
  const allExercisesPicked = checkIfAllExercisesChosen(
    task,
    exercisesChosen,
    setExercisesChosen
  );

  // Update the exercisesChosen state when the user picks a move
  function updateExercisesChosen(moveObject, exerciseType, block) {
    const newExercisesChosen = [...exercisesChosen];
    const blockToChange = { ...newExercisesChosen[block] };
    blockToChange[exerciseType] = moveObject;
    newExercisesChosen[block] = {
      ...newExercisesChosen[block],
      [exerciseType]: moveObject,
    };

    setExercisesChosen(newExercisesChosen);
  }

  // save chosen movements to the userProfile
  async function saveMovesToProfile() {
    try {
      await controllers.SET_CHOSEN_MOVEMENTS(
        key,
        task.moduleId,
        exercisesChosen
      );
    } catch (error) {
      console.error(
        "Something bad happened when trying to save the movements",
        error
      );
    }
  }

  // This is a bit of a complicated if block.
  // * First, check if showMovePicker is true and display the movement picker
  // * Next check to see if the movements are NOT loade\d, and display a loading
  //   spinner if they aren't. Otherwise, make sure there the correct number of
  //   movements set.
  // * Finally, if everything is fine then the EDT set UI will be displayed.
  // TODO: change to guard closure

  let content;
  if (showMovePicker) {
    content = (
      <TaskMovementPicker
        moduleId={task.moduleId}
        week={team.experiment.week}
        userProfile={userProfile}
        moveTypes={task.moveTypes}
        toggleView={toggleShowMovePicker}
        exercises={exercisesChosen}
        updateExercise={updateExercisesChosen}
        saveExercises={saveMovesToProfile}
        explorer={false}
      />
    );
  } else if (!task.moveTypes[task.edtBlock]) {
    // sometimes we forget to give this edt block some moves in the module database
    content = (
      <IonCard>
        <IonText className="ion-text-center">
          <h1>No moves have been specified in the task</h1>
        </IonText>
      </IonCard>
    );
  } else if (!allExercisesPicked) {
    // this is basically just a card to say you need to select moves
    content = (
      <IonCard>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol className="ion-text-center">
                <IonText>
                  <h2>You need to select your moves</h2>
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center">
                <IonButton onClick={toggleShowMovePicker}>
                  <IonIcon icon={barbellOutline} slot="start" />
                  Choose Moves
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
    );
  } else {
    // if there are no problems, then we can display the edt UI
    const block = exercisesChosen[task.edtBlock];
    const moveA = block[task.moveTypes[task.edtBlock][0].replaceAll(" ", "+")];
    const moveB = block[task.moveTypes[task.edtBlock][1].replaceAll(" ", "+")];
    const length = task.length || 7;
    content = (
      <>
        <TimerEDT
          isSnack={isSnack}
          changeMoves={toggleShowMovePicker}
          exercises={[moveA, moveB]}
          onSubmit={onSubmit}
          mins={length} // this is always 7 minutes for an EDT set
          secs={0}
        />
      </>
    );
  }

  return <>{content}</>;
}

export default addControllersProp(EdtTask);
