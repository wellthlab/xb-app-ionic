import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
} from "@ionic/react";
import React, { Component } from "react";
import { useEffect } from "react";
import Block from "./components/Block";
import "./BlockPlanner.css";
import { useHistory } from "react-router-dom";
import { isPropertyDeclaration } from "typescript";

const studyPlanner = [
  [["bilateral push", "bilateral pull"]], //week 0
  [["bilateral push", "bilateral pull"]], //week 1
  [["bilateral upper push", "bilateral upper pull"], ["bilateral lower push", "bilateral lower pull"]], //week 2
  [["bilateral upper pull", "bilateral lower pull"], ["bilateral upper push", "bilateral lower push"], ["isolateral", "isolateral"]], //week 3
  [["isolateral", "isolateral"], ["isolateral", "isolateral"], ["isolateral", "isolateral"], ["isolateral", "isolateral"]], //week 4
  [["balance assessment", "balance practice"], ["isolateral", "isolateral"], ["isolateral", "isolateral"], ["isolateral", "isolateral"], ["isolateral", "isolateral"]], //week 5
  [["push", "pull"]], //week 6
  [["push", "pull"]], //week 7
  [["push", "pull"]], //week 8
  [["push", "pull"]], //week 9
  [["push", "pull"]], //week 10
  [["push", "pull"]], //week 11
  [["push", "pull"]], //week 12
  [["push", "pull"]], //week 13
  [["push", "pull"]], //week 14
  [["push", "pull"]], //week 15
  [["push", "pull"]], //week 16
]

const BlockPlanner = (props) => {
  useEffect(() => {}, []);
  const history = useHistory();

  //expecting week to be passed as prop
  let week = props.week;

  let day = props.day;
  
  let blocks = (week == -1 || props.explorer) ? studyPlanner[15] : studyPlanner[week]; //if it's exploration week, just look at what's gona be in week 0
  let storageKey = week == -1 ? "blocks-week-0" : "blocks-week-" + week;

  if (storageKey in window.localStorage) {
    console.log("Local storage exists. Not overwriting...");
  } else {
    // Fills the array with default messages
    var blockArray = [];
    for (const eachBlockIndex in blocks) {
      const eachBlock = blocks[eachBlockIndex];
      var moveArray = {};
      for (const eachMoveIndex in eachBlock) {
        const eachMove = eachBlock[eachMoveIndex].split(' ').join('+');
        moveArray[eachMove] = {name: "No move chosen"};
      }
      blockArray.push(moveArray);
    }

    setCurrentBlock(blockArray);
    console.log("Local storage does not exist. Overwriting...");
  }
  // if the state is undefined then no move has been picked
  if (typeof props.location.state !== "undefined") {
    
    const chosenBlock = getCurrentBlock(); //retrieve prvious exercises
    const index = props.location.state.blockIndex;
    const chosenExercise = props.location.state.chosenExercise;
    const type = props.location.state.exerciseType;

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
        if (eachMove.name != "No move chosen"){
          noExercisesChosen++;
        }
        noExercisesRequired++
      }
    }

    return noExercisesChosen == noExercisesRequired;
  }

  function getCurrentBlock() {
    return JSON.parse(window.localStorage.getItem(storageKey));
  }

  // Stores chosen movements in localStorage to save them during selection
  function setCurrentBlock(chosenBlock) {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify(chosenBlock)
    );
  }

  if (props.explorer){ //if it's explorer, mark task as done in localstorage for the day
    console.log("EXPLORING DAY", storageKey + "-day-" + day)
    window.localStorage.setItem(
      storageKey + "-day-" + day,
      "explored"
    );
  }
  return (
   
   <div>
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
        {props.explorer ? 
          <></> 
          : 
          checkIfExercisesAreChosen() ? <IonButton
          onClick={(event) => {

            window.localStorage.setItem(
              storageKey + "-set",
              JSON.stringify(getCurrentBlock())
            );
            history.push("/box/move");
          }}
        >
          Set Exercises
        </IonButton> : <></>
          }
        </div>
    //   </IonContent>
    // </IonPage>
    
  );
};

export default BlockPlanner;
