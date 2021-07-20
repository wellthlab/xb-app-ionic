import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonCardContent,
  IonButton,
} from "@ionic/react";
import React from "react";
import "./Block.css";
import { useHistory } from "react-router";
import Moves from "./strength/moves.json";
import { useEffect } from "react";

const Block = (props) => {
  const blockIndex = props.blockIndex;
  const filter = props.filter;
  const moveSelected = props.exerciseChosen;
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
  }
  processMovements();
  return (
    <IonCard>
      <IonCardHeader className="block-header">
        <IonCardTitle>Block {blockIndex + 1}</IonCardTitle>
        <IonCardSubtitle className="block-header-filter">
          {filter}
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          className="block-button"
          onClick={(event) => {
            history.push({
              pathname: "/movement-picker",
              state: {
                movements: movements,
                blockIndex: blockIndex,
              },
            });
          }}
        >
          <div className="block-button-container">
            <div className="container-left">
              <p id="move-selected">{moveSelected}</p>
            </div>
            <div className="container-right">
              <p id="select-text">Select {">"}</p>
            </div>
          </div>
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default Block;
