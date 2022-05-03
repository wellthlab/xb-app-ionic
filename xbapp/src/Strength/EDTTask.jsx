import { useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonButton,
} from "@ionic/react";

import { addControllersProp } from "../util_model/controllers";
import TimerEDT from "./components/EDTMovementTimer";
import TaskMovementPicker from "./components/TaskMovementPicker";

import Moves from "./moves.json";

const moves = Moves.moves;

function getMove(id) {
  for (const i in moves) {
    let m = moves[i];
    if (m.id === id) {
      return m;
    }
  }

  return false;
}

function defaultMoveForType(type) {
  switch (type) {
    // Bilateral
    case "bilateral lower push":
      return "fullsquat";
    case "bilateral lower pull":
      return "wallrdlprep";
    case "bilateral upper push":
      return "flatpushup";
    case "bilateral upper pull":
      return "chinup";
    // Unilateral
    case "unilateral lower push":
      return "vsit";
    case "unilateral lower pull":
      return "lsit";
    case "unilateral upper push":
      return "sideplank";
    case "unilateral upper pull":
      return "onearmpull";
    // Isometric -- TODO: need to hear back from mc
    // case "isolateral lower push":
    //   return "vsit";
    // case "isolateral lower pull":
    //   return "lsit";
    // case "isolateral upper push":
    //   return "sideplank";
    // case "isolateral upper pull":
    //   return "onearmpull";
    default:
      return "fullsquat";
  }
}

/**
 * Render the UI for an EDT set or for picking move variations.
 *
 * @param task
 * @param team
 * @param userProfile
 * @param day
 * @param week
 * @param onSubmit
 * @param controllers
 */
function EDTSet({ task, team, userProfile, day, week, onSubmit, controllers }) {
  // We need something stateful to tell react when to display the movement
  // picker and when to display the actual tasks
  const [showMovePicker, setShowMovePicker] = useState(false);
  function toggleShowMovePicker() {
    setShowMovePicker(!showMovePicker);
  }

  const isSnack = task.module.topic.includes("snack/");

  // TODO: decide if should be by playlist week, or absolute week?
  const playlistWeek = isSnack
    ? 0
    : parseInt((userProfile.modules[task.moduleId].stage + 1) % 5, 10);
  const key = "blocks-week-" + playlistWeek;
  // const key = "blocks-week-" + week;

  // When there are no exercises, then fill with default "Select a Move"
  // messages
  function createEmptyMovementsChosen() {
    const blockArray = [];
    for (const eachBlockIndex in task.moveTypes) {
      const eachBlock = task.moveTypes[eachBlockIndex];
      const movesPicked = {};
      for (const eachMoveIndex in eachBlock) {
        const eachMove = eachBlock[eachMoveIndex].split(" ").join("+");
        movesPicked[eachMove] = { name: "Select a Move" };
      }
      blockArray.push(movesPicked);
    }

    return blockArray;
  }

  function getDefaultMoves() {
    const blockArray = [];
    for (const eachBlockIndex in task.moveTypes) {
      const eachBlock = task.moveTypes[eachBlockIndex];
      const movesPicked = {};
      for (const eachMoveIndex in eachBlock) {
        const eachMove = eachBlock[eachMoveIndex];
        movesPicked[eachMove.replaceAll(" ", "+")] = getMove(
          defaultMoveForType(eachMove)
        );
      }
      blockArray.push(movesPicked);
    }

    return blockArray;
  }

  // Set up the exercisesChosen variable, where it will either be taken from
  // the userProfile or the default "Select a Move" messages. These are
  // displayed on the buttons for BlockPlanner
  // TODO: nested ternary is not readable
  const [exercisesChosen, setExercisesChosen] = useState(
    isSnack
      ? getDefaultMoves()
      : userProfile.modules[task.moduleId].edtMoves[key]
      ? userProfile.modules[task.moduleId].edtMoves[key]
      : createEmptyMovementsChosen()
  );

  function updateExercisesChosen(moveObject, exerciseType, block) {
    let newExercisesChosen = [...exercisesChosen];
    let blockToChange = { ...newExercisesChosen[block] };
    blockToChange[exerciseType] = moveObject;
    newExercisesChosen[block] = {
      ...newExercisesChosen[block],
      [exerciseType]: moveObject,
    };

    setExercisesChosen(newExercisesChosen);
  }

  function checkIfExercisesAreChosen() {
    let numChosen = 0;
    let numRequired = exercisesChosen.length * 2;
    for (const block of exercisesChosen) {
      for (const exercise of Object.values(block)) {
        if (exercise.name !== "Select a Move") {
          numChosen++;
        }
      }
    }

    return numChosen === numRequired; // are all the exercises chosen?;
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
        "Something bad happened when trying to save the movements??? :-(",
        error
      );
    }
  }

  // This is a bit of a complicated if block.
  // * First, check if showMovePicker is true and display the movement picker
  // * Next check to see if the movements are NOT loaded, and display a loading
  //   spinner if they aren't. Otherwise, make sure there the correct number of
  //   movements set.
  // * Finally, if everything is fine then the EDT set UI will be displayed.

  const movementPicked = checkIfExercisesAreChosen();
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
        updateExercises={updateExercisesChosen}
        saveExercises={saveMovesToProfile}
      />
    );
  } else if (movementPicked === false) {
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
                  Choose Moves
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
    );
  } else {
    // TODO: fix inconsistency with spaces and +'s in exercise type string
    const block = exercisesChosen[task.edtBlock];
    const moveA = block[task.moveTypes[task.edtBlock][0].replaceAll(" ", "+")];
    const moveB = block[task.moveTypes[task.edtBlock][1].replaceAll(" ", "+")];
    content = (
      <>
        <TimerEDT
          isSnack={isSnack}
          changeMoves={toggleShowMovePicker}
          exercises={[moveA, moveB]}
          onSubmit={onSubmit}
          mins={7} // this is always 7 minutes for an EDT set
          secs={0}
        />
      </>
    );
  }

  return <>{content}</>;
}

export default addControllersProp(EDTSet);
