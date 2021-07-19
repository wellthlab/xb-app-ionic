import { IonContent, IonHeader, IonPage } from "@ionic/react";
import React, { Component } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Block from "../components/Block";

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

  return (
    <IonPage>
      <IonHeader title="Block Planner"></IonHeader>
      <IonContent style={{ paddingTop: "30px" }}>
        {blocks.map((filter, index) => (
          <Block
            key={index}
            blockIndex={index}
            filter={filter}
            exerciseChosen={getChosenExercises()[index]}
          ></Block>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default BlockPlanner;
