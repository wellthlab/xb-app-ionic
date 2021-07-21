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
import Block from "../components/Block";
import "./BlockPlanner.css";

const BlockPlanner = (props) => {
  useEffect(() => {}, []);

  // Expecting blocks to be passed as a prop
  let blocks;
  if (!("blocks" in props)) {
    blocks = ["pull", "push", "pull", "push"];
  }

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

  function setChosenExercises(chosenExercises) {
    window.localStorage.setItem(
      "exercisesChosen",
      JSON.stringify(chosenExercises)
    );
  }

  // Takes an array and looks for 0 occurances of the string ""No exercise chosen"". If the count is zero, it returns true, otherwise false
  function allExercisesChosen(exercises) {
    for (let i = 0; i < exercises.length; ++i) {
      if (exercises[i] === "No exercise chosen") {
        return false;
      }
    }
    return true;
  }

  return (
    <IonPage>
      <IonHeader title="Block Planner">
        <IonButtons>
          <IonBackButton defaultHref="/"></IonBackButton>
        </IonButtons>
        <IonTitle className="header-title">Block Planner</IonTitle>
      </IonHeader>
      <IonContent className="planner-content">
        {blocks.map((filter, index) => (
          <Block
            key={index}
            blockIndex={index}
            filter={filter}
            exerciseChosen={getChosenExercises()[index]}
          ></Block>
        ))}
        <IonButton
          onClick={(event) => {
            const chosenExercises = getChosenExercises();
            const submitExercises = allExercisesChosen(chosenExercises);
            console.log(submitExercises);
          }}
        >
          Choose Exercise
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default BlockPlanner;
