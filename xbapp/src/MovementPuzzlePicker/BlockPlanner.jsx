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
  const exercisesChosen = props.exercises;

  function getCurrentBlock() {
    return exercisesChosen;
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
