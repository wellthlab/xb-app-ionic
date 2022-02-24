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
import React, { Component } from "react";
import { useEffect } from "react";
import Block from "./components/Block";
import "./BlockPlanner.css";
import { useHistory } from "react-router-dom";
import { isPropertyDeclaration } from "typescript";
import { useLocation } from "react-router-dom";

var studyPlanner = [
  [["bilateral push", "bilateral pull"]], //week 0
  [["bilateral lower push", "bilateral upper push"]], //week 1
  [
    ["bilateral lower push", "bilateral upper push"],
    // ["bilateral lower push", "bilateral lower pull"],
  ], //week 2
  [
    ["bilateral upper pull", "bilateral lower pull"],
    ["bilateral upper push", "bilateral lower push"],
    ["isolateral", "isolateral"],
  ], //week 3
  [
    ["isolateral", "isolateral"],
    ["isolateral", "isolateral"],
    ["isolateral", "isolateral"],
    ["isolateral", "isolateral"],
  ], //week 4,
  [
    ["balance assessment", "balance practice"],
    ["isolateral", "isolateral"],
    ["isolateral", "isolateral"],
    ["isolateral", "isolateral"],
    ["isolateral", "isolateral"],
  ], //week 5
  [
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
  ], //week 6
  [
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
  ], //week 7
  [
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
  ], //week 8
  [
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
  ], //week 9
  [
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
  ], //week 10
  [
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
  ], //week 11
  [
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
  ], //week 12
  [
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
  ], //week 13
  [
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
  ], //week 14
  [
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
  ], //week 15
  [
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
    ["bilateral push", "bilateral pull"],
  ], //week 16
];

const BlockPlanner = (props) => {
  const location = useLocation(); // switched to location hook
  const history = useHistory();

  //expecting week to be passed as prop
  let week = props.week;
  let day = props.day;

  if (week >= 6 && week <= 8) {
    var oldStudyPlanner = studyPlanner[week];
    for (var i = 0; i < 5; i++) {
      //going through all blocks
      if (
        !(
          window.localStorage.getItem("block-type-" + (i + 1).toString()) ==
          null
        )
      ) {
        var booleanInMemory = window.localStorage.getItem(
          "block-type-" + (i + 1).toString()
        );
        oldStudyPlanner[i] =
          booleanInMemory === false
            ? ["bilateral push", "bilateral pull"]
            : ["isolateral", "isolateral"];
        console.log("BLOCK ", oldStudyPlanner[i]);
      }
    }
    studyPlanner[week] = oldStudyPlanner;
    console.log("STUDY PLANNER<", studyPlanner);
  }

  const [blocks, setBlocks] = React.useState(
    week === -1 || props.explorer ? studyPlanner[15] : studyPlanner[week]
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
    const chosenBlock = getCurrentBlock(); //retrieve prvious exercises
    const index = location.state.blockIndex;
    const chosenExercise = location.state.chosenExercise;
    const type = location.state.exerciseType;

    chosenBlock[index][type] = chosenExercise;

    setCurrentBlock(chosenBlock);
  }

  function checkIfExercisesAreChosen() {
    const chosenBlock = getCurrentBlock();
    var noExercisesRequired = 0;
    var noExercisesChosen = 0;
    for (const eachBlockIndex in chosenBlock) {
      const eachBlock = chosenBlock[eachBlockIndex];
      for (const eachMoveIndex in eachBlock) {
        const eachMove = eachBlock[eachMoveIndex];
        if (eachMove.name !== "No move chosen") {
          noExercisesChosen++;
        }
        noExercisesRequired++;
      }
    }

    return noExercisesChosen === noExercisesRequired;
  }

  function getCurrentBlock() {
    return JSON.parse(window.localStorage.getItem(storageKey));
  }

  // Stores chosen movements in localStorage to save them during selection
  function setCurrentBlock(chosenBlock) {
    window.localStorage.setItem(storageKey, JSON.stringify(chosenBlock));
  }

  function setBlocksTypeInMemory(chosenBlock, value) {
    window.localStorage.setItem(
      "block-type-" + chosenBlock.toString(),
      JSON.stringify(value)
    );
  }
  function getBlocksTypeInMemory(chosenBlock) {
    if (
      window.localStorage.getItem("block-type-" + chosenBlock.toString()) ===
      null
    ) {
      return false;
    } else
      return window.localStorage.getItem(
        "block-type-" + chosenBlock.toString()
      );
  }

  if (props.explorer) {
    //if it's explorer, mark task as done in localstorage for the day
    console.log("EXPLORING DAY", storageKey + "-day-" + day);
    window.localStorage.setItem(storageKey + "-day-" + day, "explored");
  }

  const [block1Check, setBlock1Check] = React.useState(
    getBlocksTypeInMemory(1)
  ); //"false" is bilateral and isolaterals will be true
  const [block2Check, setBlock2Check] = React.useState(
    getBlocksTypeInMemory(2)
  );
  const [block3Check, setBlock3Check] = React.useState(
    getBlocksTypeInMemory(3)
  );
  const [block4Check, setBlock4Check] = React.useState(
    getBlocksTypeInMemory(4)
  );
  const [block5Check, setBlock5Check] = React.useState(
    getBlocksTypeInMemory(5)
  );

  function setBlocksAgain(blockNumber, valueOFtoggle) {
    if (blockNumber === 1) {
      setBlock1Check(valueOFtoggle);
    } else if (blockNumber === 2) {
      setBlock2Check(valueOFtoggle);
    } else if (blockNumber === 3) {
      setBlock3Check(valueOFtoggle);
    } else if (blockNumber === 4) {
      setBlock4Check(valueOFtoggle);
    } else if (blockNumber === 5) {
      setBlock5Check(valueOFtoggle);
    }
    var oldStudyPlanner = studyPlanner;
    oldStudyPlanner[week][blockNumber - 1] =
      valueOFtoggle === false
        ? ["bilateral push", "bilateral pull"]
        : ["isolateral", "isolateral"];
    console.log(
      "1 ENTERING",
      valueOFtoggle,
      blockNumber,
      oldStudyPlanner[week][blockNumber - 1]
    );

    var blockArray = [];
    console.log("A DEBUGGING", oldStudyPlanner[week]);
    for (const eachBlockIndex in oldStudyPlanner[week]) {
      const eachBlock = oldStudyPlanner[week][eachBlockIndex];
      var moveArray = {};
      for (const eachMoveIndex in eachBlock) {
        const eachMove = eachBlock[eachMoveIndex].split(" ").join("+");
        moveArray[eachMove] = { name: "No move chosen" };
      }
      console.log("B DEBUGGING", moveArray);
      blockArray.push(moveArray);
    }
    var newArray = []; //because react doesnt detect a change in the original array - so we must feed it a new one
    for (const obj of oldStudyPlanner[week]) {
      newArray.push(obj);
    }
    console.log("2 in memory", blockArray);
    setCurrentBlock(blockArray);
    setBlocks(newArray);
    setBlocksTypeInMemory(blockNumber, valueOFtoggle);
  }
  return (
    <div>
      {week >= 5 ? (
        <>
          <p>
            You have the option to select what types each block is. Use the
            toggle button to change these as you wish.
          </p>
          <IonItem>
            Block 1: Bilaterals
            <IonToggle
              checked={block1Check}
              onIonChange={(e) => {
                setBlocksAgain(1, e.detail.checked);
              }}
            />
            Isolaterals
          </IonItem>
          <IonItem>
            Block 2: Bilaterals
            <IonToggle
              checked={block2Check}
              onIonChange={(e) => {
                setBlocksAgain(2, e.detail.checked);
              }}
            />
            Isolaterals
          </IonItem>
          <IonItem>
            Block 3: Bilaterals
            <IonToggle
              checked={block3Check}
              onIonChange={(e) => {
                setBlocksAgain(3, e.detail.checked);
              }}
            />
            Isolaterals
          </IonItem>
          <IonItem>
            Block 4: Bilaterals
            <IonToggle
              checked={block4Check}
              onIonChange={(e) => {
                setBlocksAgain(4, e.detail.checked);
              }}
            />
            Isolaterals
          </IonItem>
          <IonItem>
            Block 5: Bilaterals
            <IonToggle
              checked={block5Check}
              onIonChange={(e) => {
                setBlocksAgain(5, e.detail.checked);
              }}
            />
            Isolaterals
          </IonItem>
        </>
      ) : (
        <></>
      )}
      {/* //iterate through number of blocks needed */}
      {blocks.map((blockDesc, index) => (
        <Block
          typeOfBlock={blockDesc}
          key={index}
          blockIndex={index}
          exerciseChosen={getCurrentBlock()[index]} // would be {push: "no move", pull: "nomove"}
          explorer={props.explorer}
          week={week}
        ></Block>
      ))}
      {props.explorer ? (
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
      )}
    </div>
  );
};

export default BlockPlanner;
