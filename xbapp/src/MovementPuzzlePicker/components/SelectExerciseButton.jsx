import React from "react";
import { IonButton } from "@ionic/react";

import "./SelectExerciseButton.css";
import { BlockIndexContext } from "../context/BlockIndexContext";

const SelectExerciseButton = (props) => {
  const typeOfExercise = props.typeOfExercise;

  function selectExercise(blockIndex) {
    props.updateExercises(props.movement, typeOfExercise, blockIndex);
    props.setContent(undefined); // this stops the movement picker from being displayed
  }

  return (
    <BlockIndexContext.Consumer>
      {(blockIndex) => (
        <IonButton
          className="tile-button"
          onClick={() => {
            selectExercise(blockIndex);
          }}
        >
          Select
        </IonButton>
      )}
    </BlockIndexContext.Consumer>
  );
};

export default SelectExerciseButton;
