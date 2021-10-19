import React from "react";
import { useHistory } from "react-router";
import { IonButton } from "@ionic/react";
import { BlockIndexContext } from "../context/BlockIndexContext";
import "./SelectExerciseButton.css";

const SelectExerciseButton = (props) => {
  const history = useHistory();
  function selectExercise(blockIndex) {
    history.push({
      pathname: "/",
      state: {
        [blockIndex]: props.movement,
        chosenExercise: props.movement,
        blockIndex: blockIndex,
      },
    });
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
