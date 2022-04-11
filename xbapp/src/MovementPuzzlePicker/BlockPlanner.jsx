import React from "react";

import Block from "./components/Block";
import "./BlockPlanner.css";

const explorerPlan = [
  ["bilateral push", "bilateral pull"],
  ["bilateral push", "bilateral pull"],
  ["bilateral push", "bilateral pull"],
  ["bilateral push", "bilateral pull"],
  ["bilateral push", "bilateral pull"],
];

const BlockPlanner = (props) => {
  let moveTypes = props.moveTypes;
  let week = props.week;
  let day = props.day;

  const [blocks, setBlocks] = React.useState(
    props.explorer ? explorerPlan : moveTypes
  );

  let storageKey = week === -1 ? "blocks-week-0" : "blocks-week-" + week;

  // If there are no movements in localStorage, then fill it with default
  // message

  const exercisesChosen = props.exercises;

  // for(const block of exercisesChosen) {
  //   setCurrentBlock()
  // }

  // if (!(storageKey in window.localStorage)) {
  //   var blockArray = [];
  //   for (const eachBlockIndex in blocks) {
  //     const eachBlock = blocks[eachBlockIndex];
  //     var movesPicked = {};
  //     for (const eachMoveIndex in eachBlock) {
  //       const eachMove = eachBlock[eachMoveIndex].split(" ").join("+");
  //       movesPicked[eachMove] = { name: "Select a Move" };
  //     }
  //     blockArray.push(movesPicked);
  //   }

  //   debugger;
  //   setCurrentBlock(blockArray);
  // }

  // if the state is undefined then no move has been picked
  // if (window.history.state.exercisesSet === true) {
  //   const chosenBlock = getCurrentBlock(); //retrieve previous exercises
  //   const index = window.history.state.blockIndex;
  //   const chosenExercise = window.history.state.chosenExercise;
  //   const type = window.history.state.exerciseType;

  //   chosenBlock[index][type] = chosenExercise;
  //   setCurrentBlock(chosenBlock);
  // }

  function getCurrentBlock() {
    // return JSON.parse(window.localStorage.getItem(storageKey));
    return exercisesChosen;
  }

  // Stores chosen movements in localStorage to save them during selection
  function setCurrentBlock(chosenBlock) {
    window.localStorage.setItem(storageKey, JSON.stringify(chosenBlock));
  }

  if (props.explorer) {
    //if it's explorer, mark task as done in localstorage for the day
    window.localStorage.setItem(storageKey + "-day-" + day, "explored");
  }

  const blockButtons = blocks.map((blockDesc, index) => {
    return (
      <Block
        typeOfBlock={blockDesc}
        key={index}
        blockIndex={index}
        exerciseChosen={getCurrentBlock()[index]} // would be {push: "no move", pull: "nomove"}
        explorer={props.explorer}
        week={week}
        updateExercises={props.updateExercises}
        setContent={props.setContent}
      />
    );
  });

  return <>{blockButtons}</>;
};

export default BlockPlanner;
