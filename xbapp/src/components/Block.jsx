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
import Moves from "./strength/moves.json";
import { useEffect } from "react";

const Block = (props) => {
  const index = props.index;
  const filter = props.filter;
  const [moveSelected, setMoveSelected] = useState("No move selected");
  const history = useHistory();
  const movements = {};
  // Maybe this should be a state?
  let filteredMoves;
  useEffect(() => {}, []);

  function processMovements() {
    // Uses the passed filter to filter the moves
    filteredMoves = Moves.moves.filter((obj) => {
      return obj.type === filter;
    });

    movements.upperBody = filteredMoves.slice(
      0,
      Math.floor(filteredMoves.length / 3)
    );
    movements.upperBody.sort((a, b) => {
      return a.progressionLevel - b.progressionLevel;
    });
    movements.fullBody = filteredMoves.slice(
      Math.floor(filteredMoves.length / 3),
      Math.floor(filteredMoves.length / 3) * 2
    );
    movements.fullBody.sort((a, b) => {
      return a.progressionLevel - b.progressionLevel;
    });
    movements.lowerBody = filteredMoves.slice(
      Math.floor(filteredMoves.length / 3) * 2,
      filteredMoves.length
    );
    movements.lowerBody.sort((a, b) => {
      return a.progressionLevel - b.progressionLevel;
    });
    console.log("Activated filters");
  }
  processMovements();
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
            state: {
              movements: movements,
              test: "test",
            },
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
