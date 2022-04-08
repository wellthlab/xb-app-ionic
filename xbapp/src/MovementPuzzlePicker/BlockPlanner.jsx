import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonItem,
  IonCol,
  IonToggle,
} from "@ionic/react";
import React from "react";
import Block from "./components/Block";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";

import "./BlockPlanner.css";

const explorerPlan = [
  ["bilateral push", "bilateral pull"],
  ["bilateral push", "bilateral pull"],
  ["bilateral push", "bilateral pull"],
  ["bilateral push", "bilateral pull"],
  ["bilateral push", "bilateral pull"],
];

const BlockPlanner = (props) => {
  const location = useLocation(); // switched to location hook
  const history = useHistory();

  let moveTypes = props.moveTypes;

  //expecting week to be passed as prop
  let week = props.week;
  let day = props.day;

  const [blocks, setBlocks] = React.useState(
    props.explorer ? explorerPlan : moveTypes
  ); //if it's exploration week, just look at what's gona be in week 0

  console.log("blocks", blocks);

  let storageKey = week === -1 ? "blocks-week-0" : "blocks-week-" + week;

  // If there are no movements in localStorage, then fill it with default
  // message
  if (!(storageKey in window.localStorage)) {
    var blockArray = [];
    for (const eachBlockIndex in blocks) {
      const eachBlock = blocks[eachBlockIndex];
      var movesPicked = {};
      for (const eachMoveIndex in eachBlock) {
        const eachMove = eachBlock[eachMoveIndex].split(" ").join("+");
        movesPicked[eachMove] = { name: "Select a Move" };
      }
      blockArray.push(movesPicked);
    }

    setCurrentBlock(blockArray);
  }

  // if the state is undefined then no move has been picked
  if (window.history.state.exercisesSet === true) {
    console.log("Looking at the state");
    const chosenBlock = getCurrentBlock(); //retrieve previous exercises
    const index = window.history.state.blockIndex;
    const chosenExercise = window.history.state.chosenExercise;
    const type = window.history.state.exerciseType;

    chosenBlock[index][type] = chosenExercise;
    setCurrentBlock(chosenBlock);
  }

  // function checkIfExercisesAreChosen() {
  //   const chosenBlock = getCurrentBlock();
  //   var numExercisesRequired = 0;
  //   var numExercisesChosen = 0;
  //   for (const eachBlockIndex in chosenBlock) {
  //     const eachBlock = chosenBlock[eachBlockIndex];
  //     for (const eachMoveIndex in eachBlock) {
  //       const eachMove = eachBlock[eachMoveIndex];
  //       if (eachMove.name !== "No move chosen") {
  //         numExercisesChosen++;
  //       }
  //       numExercisesRequired++;
  //     }
  //   }

  //   return numExercisesChosen === numExercisesRequired;
  // }

  function getCurrentBlock() {
    return JSON.parse(window.localStorage.getItem(storageKey));
  }

  // Stores chosen movements in localStorage to save them during selection
  function setCurrentBlock(chosenBlock) {
    window.localStorage.setItem(storageKey, JSON.stringify(chosenBlock));
  }

  if (props.explorer) {
    //if it's explorer, mark task as done in localstorage for the day
    window.localStorage.setItem(storageKey + "-day-" + day, "explored");
  }

  const blockButtons = blocks.map((blockDesc, index) => {
    return (
      <Block
        typeOfBlock={blockDesc}
        key={index}
        blockIndex={index}
        exerciseChosen={getCurrentBlock()[index]} // would be {push: "no move", pull: "nomove"}
        explorer={props.explorer}
        week={week}
        setContent={props.setContent}
      />
    );
  });

  return (
    <>
      {/* //iterate through number of blocks needed */}
      {blockButtons}

      {/* {props.explorer ? (
        <></>
      ) : checkIfExercisesAreChosen() ? (
        <IonButton
          expand={"full"}
          onClick={() => {
            props.onSubmit({
              type: "strength-setter",
              exercises: getCurrentBlock(),
            });
            window.localStorage.setItem(
              storageKey + "-set",
              JSON.stringify(getCurrentBlock())
            );
            history.push("/box/move");
          }}
        >
          Set Exercises
        </IonButton>
      ) : (
        <></>
      )} */}
    </>
  );
};

export default BlockPlanner;
