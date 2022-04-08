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

  let moveTypes = props.moveTypes || location.state.moveTypes;

  //expecting week to be passed as prop
  let week = props.week;
  let day = props.day;

  const [blocks, setBlocks] = React.useState(
    props.explorer ? explorerPlan : moveTypes
  ); //if it's exploration week, just look at what's gona be in week 0

  let storageKey = week === -1 ? "blocks-week-0" : "blocks-week-" + week;

  if (storageKey in window.localStorage) {
    console.log("Local storage exists. Not overwriting...");
  } else {
    // Fills the array with default messages
    var blockArray = [];
    for (const eachBlockIndex in blocks) {
      const eachBlock = blocks[eachBlockIndex];
      var moveArray = {};
      for (const eachMoveIndex in eachBlock) {
        const eachMove = eachBlock[eachMoveIndex].split(" ").join("+");
        moveArray[eachMove] = { name: "No move chosen" };
      }
      blockArray.push(moveArray);
    }

    setCurrentBlock(blockArray);
    console.log("Local storage does not exist. Overwriting...");
  }
  // if the state is undefined then no move has been picked
  if (typeof location.state !== "undefined") {
    const chosenBlock = getCurrentBlock(); //retrieve previous exercises
    const index = location.state.blockIndex;
    const chosenExercise = location.state.chosenExercise;
    const type = location.state.exerciseType;

    chosenBlock[index][type] = chosenExercise;

    setCurrentBlock(chosenBlock);
  }

  function checkIfExercisesAreChosen() {
    const chosenBlock = getCurrentBlock();
    var numExercisesRequired = 0;
    var numExercisesChosen = 0;
    for (const eachBlockIndex in chosenBlock) {
      const eachBlock = chosenBlock[eachBlockIndex];
      for (const eachMoveIndex in eachBlock) {
        const eachMove = eachBlock[eachMoveIndex];
        if (eachMove.name !== "No move chosen") {
          numExercisesChosen++;
        }
        numExercisesRequired++;
      }
    }

    return numExercisesChosen === numExercisesRequired;
  }

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

  // debugger;

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
