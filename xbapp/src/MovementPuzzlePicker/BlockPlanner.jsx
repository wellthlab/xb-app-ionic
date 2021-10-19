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

const studyPlanner = [
  [["push", "pull"]], //week 0
  [["push", "pull"]], //week 1
  [["push", "pull"], ["push", "pull"]], //week 2
  [["lower push", "lower pull"], ["balance"], ["upper push", "upper pull"]], //week 3
  [["unilateral lower pull"], ["unilateral lower push"], ["balance"], ["upper push", "upper pull"]], //week 4
  [["unilateral lower pull"], ["unilateral lower push"], ["balance"], ["upper push", "upper pull"], ["iso push", "iso pull"]], //week 5
  [["push", "pull", "balance"]], //week 6
  [["push", "pull", "balance"]], //week 7
  [["push", "pull", "balance"]], //week 8
  [["push", "pull", "balance"]], //week 9
  [["push", "pull", "balance"]], //week 10
  [["push", "pull", "balance"]], //week 11
  [["push", "pull", "balance"]], //week 12
  [["push", "pull", "balance"]], //week 13
  [["push", "pull", "balance"]], //week 14
  [["push", "pull", "balance"]], //week 15
  [["push", "pull", "balance"]], //week 16
]

const BlockPlanner = (props) => {
  useEffect(() => {}, []);

  console.log("is week", props.week);
  //expecting week to be passed as prop
  let week = props.week;


  let blocks = studyPlanner[week];
  // if (!("blocks" in props)) {
  //   blocks = ["pull", "push", "pull", "push"];
  // }

  // TODO: set localStorage to clear at some point. Probably best to when leaving the routes associated
  if ("exercisesChosen" in window.localStorage) {
    console.log("Local storage exists. Not overwriting...");
  } else {
    // Fills the array with default messages
    setChosenExercises(new Array(blocks.length).fill("No exercise chosen"));
    console.log("Local storage does not exist. Overwriting...");
  }
  // Need to make sure that state is not undefined first
  if (typeof props.location.state !== "undefined") {
    const chosenExercises = getChosenExercises();
    const index = props.location.state.blockIndex;
    const chosenExercise = props.location.state.chosenExercise;
    chosenExercises[index] = chosenExercise.name;
    setChosenExercises(chosenExercises);
  }

  function getChosenExercises() {
    return JSON.parse(window.localStorage.getItem("exercisesChosen"));
  }

  // Stores chosen movements in localStorage to save them during selection
  function setChosenExercises(chosenExercises) {
    window.localStorage.setItem(
      "exercisesChosen",
      JSON.stringify(chosenExercises)
    );
  }

  return (
   
    // <IonPage>
    //   <IonHeader title="Block Planner">
    //     <IonButtons>
    //       <IonBackButton defaultHref="/"></IonBackButton>
    //     </IonButtons>
    //     <IonTitle className="header-title">Block Planner</IonTitle>
    //   </IonHeader>
    //   <IonContent className="planner-content">
    <div>
      {/* //iterate through number of blocks needed */}
        {blocks.map((blockDesc, index) => (
          <Block
            typeOfBlock={blockDesc}
            key={index}
            blockIndex={index}
            exerciseChosen={getChosenExercises()[index]}
            explorer={props.explorer}
          ></Block>
        ))}
        {props.explorer ? 
          <></> 
          : 
          <IonButton
          onClick={(event) => {
            // TODO: Submits exercises to be used in another component
            console.log("Exercise chosen");
            // Clear chosen movements
            window.localStorage.clear("exerciseChosen");
          }}
        >
          Choose Exercises
        </IonButton>
          }
        </div>
    //   </IonContent>
    // </IonPage>
    
  );
};

export default BlockPlanner;
