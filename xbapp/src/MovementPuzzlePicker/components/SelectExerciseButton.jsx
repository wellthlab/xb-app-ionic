import React from "react";
import { useHistory, useLocation } from "react-router";
import { IonButton } from "@ionic/react";
import { BlockIndexContext } from "../context/BlockIndexContext";
import "./SelectExerciseButton.css";
import { connect } from "react-redux";
import { addControllersProp } from "../../util_model/controllers";

const SelectExerciseButton = (props) => {
  const path = window.location.pathname;
  const team = props.teams.teams.bybox["move"][0];
  const typeOfExercise = props.typeOfExercise;
  // const history = useHistory();
  // const location = useLocation();
  function selectExercise(blockIndex) {
    window.history.pushState(
      {
        [blockIndex]: props.movement,
        chosenExercise: props.movement,
        blockIndex: blockIndex,
        exerciseType: typeOfExercise,
        exercisesSet: true,
      },
      "",
      path
    );
    // const movePicked = props.movement;
    // const moveBlockIndex = blockIndex;
    // const moveTypeOfExercise = typeOfExercise;
    // console.log(movePicked, moveBlockIndex, moveTypeOfExercise);
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
export default connect(
  (state, ownProps) => {
    return {
      account: state.account,
      teams: state.teams,
      experiments: state.experiments,
      boxes: state.boxes,
      chosenMovements: state.chosenMovements,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(SelectExerciseButton));
