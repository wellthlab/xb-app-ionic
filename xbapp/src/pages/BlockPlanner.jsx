import { IonContent, IonHeader, IonPage } from "@ionic/react";
import React, { Component } from "react";
import Block from "../components/Block";

const BlockPlanner = (props) => {
  console.log(props);
  let blocks;
  if (!("blocks" in props)) {
    blocks = ["pull", "push", "pull"];
  }
  return (
    <IonPage>
      <IonHeader title="Block Planner"></IonHeader>
      <IonContent style={{ paddingTop: "30px" }}>
        {blocks.map((filter, index) => (
          <Block key={index} index={index + 1} filter={filter}></Block>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default BlockPlanner;
