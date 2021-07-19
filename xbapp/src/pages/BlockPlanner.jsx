import { IonContent, IonHeader, IonPage } from "@ionic/react";
import React, { Component } from "react";
import Block from "../components/Block";

const BlockPlanner = (props) => {
  let blocks;
  if (!("blocks" in props)) {
    blocks = ["pull", "push", "pull", "push"];
  }
  // Fills the array with default messages
  let exercisesChosen = new Array(blocks.length).fill("No exercise chosen");
  // Need to make sure that state is not undefined first
  if (typeof props.location.state !== "undefined") {
    for (let i = 0; i < blocks.length; ++i) {
      if (i in props.location.state) {
        exercisesChosen[i] = props.location.state[i].name;
      }
    }
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
            exerciseChosen={exercisesChosen[index]}
          ></Block>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default BlockPlanner;
