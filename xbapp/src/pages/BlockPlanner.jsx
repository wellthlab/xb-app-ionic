import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
} from "@ionic/react";
import { Storage } from "@ionic/storage";
import React, { Component } from "react";
import { useEffect } from "react";
import Block from "../components/Block";
import "./BlockPlanner.css";

const BlockPlanner = (props) => {
  useEffect(() => {}, []);
  const store = new Storage();
  let keys;
  store.create().then((res) => {
    console.log("Store created");
    store
      .keys()
      .then((storeKeys) => {
        console.log("Saving active keys", storeKeys);
        keys = storeKeys;
      })
      .catch((err) => {
        console.log("Error accessing keys", err.message);
      });
  });

  async function updateKeys() {
    keys = await store.keys();
    console.log("Saving active keys", keys);
  }

  async function addToStore(key) {
    // Check if key already exists
    if (!keys.includes(key)) {
      await store.set(key, 0);
      console.log("Succesfully added key to store");
    }
    // Update the value at key
    const count = await store.get(key);
    await store.set(key, count + 1);
    console.log("Succesfully updated key in store");
    // Update the currently known keys
    updateKeys();
  }

  // Get the tally of all saved keys
  async function getFromStore() {
    try {
      const _keys = await store.keys();
      for (let i = 0; i < _keys.length; ++i) {
        const count = await store.get(keys[i]);
        console.log(keys[i], ":", count);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
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
            addToStore("go");
            getFromStore();
          }}
        >
          Choose Exercises
        </IonButton>
        <IonButton
          onClick={(event) => {
            const chosenExercises = getChosenExercises();
            if (allExercisesChosen(chosenExercises)) {
              for (let i = 0; i < chosenExercises.length; ++i) {
                // chosenExercises contains the exercise names which might be replaced in future
                console.log("Adding movement:", chosenExercises[i]);
                // This function cannot be allowed to call asynchronously
                addToStore(chosenExercises[i]);
              }
            } else {
              console.log("Cannot add until all exercises chosen");
            }
          }}
        >
          Add all
        </IonButton>
        <IonButton
          onClick={(event) => {
            getFromStore();
          }}
        >
          Get exercises
        </IonButton>
        <IonButton
          onClick={(event) => {
            test();
            store.clear().then((res) => {
              console.log("Store cleared");
              store
                .keys()
                .then((storeKeys) => {
                  console.log("Saving active keys", storeKeys);
                  keys = storeKeys;
                })
                .catch((err) => {
                  console.log("Error accessing keys", err.message);
                });
            });
          }}
        >
          Clear
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default BlockPlanner;
