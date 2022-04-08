import React from "react";
import { useHistory } from "react-router";
import { IonButton } from "@ionic/react";
import { BlockIndexContext } from "../context/BlockIndexContext";
import "./SelectExerciseButton.css";
import { connect } from "react-redux";
import { addControllersProp } from "../../util_model/controllers";

const SelectExerciseButton = (props) => {
  const pathArray = window.location.pathname.split("/");
  const typeOfExercise = pathArray[pathArray.length - 1];
  const team = props.teams.teams.bybox["move"][0];
  //const typeOfExercise = props.
  const history = useHistory();
  function selectExercise(blockIndex) {
    // history.push({
    //   pathname:
    //     "/box/move/" +
    //     team._id +
    //     "/" +
    //     team.experiment.day +
    //     "/add/strength-setter",
    //   state: {
    //     [blockIndex]: props.movement,
    //     chosenExercise: props.movement,
    //     blockIndex: blockIndex,
    //     exerciseType: typeOfExercise,
    //   },
    // });

    const movePicked = props.movement;
    const moveBlockIndex = blockIndex;
    const moveTypeOfExercise = typeOfExercise;

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
