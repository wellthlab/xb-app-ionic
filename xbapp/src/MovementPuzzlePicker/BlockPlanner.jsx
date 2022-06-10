import React from "react";

import Block from "./components/Block";
import "./BlockPlanner.css";

const explorerPlan = [
  [
    "bilateral push",
    "bilateral pull",
    "isolateral push",
    "isolateral pull",
    "balance",
  ],
];

const BlockPlanner = (props) => {
  const moveBlocks = props.explorer ? explorerPlan : props.moveTypes;
  const week = props.week;

  return (
    <>
      {moveBlocks.map((block, index) => {
        return (
          <Block
            typeOfBlock={block}
            key={index}
            blockIndex={index}
            exerciseChosen={props.exercises[index]}
            explorer={props.explorer}
            week={week}
            updateExercise={props.updateExercise}
            setContent={props.setContent}
          />
        );
      })}
    </>
  );
};

export default BlockPlanner;
