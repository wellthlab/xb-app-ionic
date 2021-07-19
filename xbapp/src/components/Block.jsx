import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import React from "react";
import { useState } from "react";
import "./Block.css";
import { useHistory } from "react-router";

const Block = (props) => {
  const index = props.index;
  const filter = props.filter;
  const [moveSelected, setMoveSelected] = useState("No move selected");
  const history = useHistory();
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Block {index}</IonCardTitle>
        <IonCardSubtitle>{filter}</IonCardSubtitle>
      </IonCardHeader>
      <IonCard
        onClick={(event) => {
          history.push({
            pathname: "/movement-picker",
            state: { filter: filter },
          });
        }}
      >
        <p>{moveSelected}</p>
        <p>Select {">"}</p>
      </IonCard>
    </IonCard>
  );
};

export default Block;
