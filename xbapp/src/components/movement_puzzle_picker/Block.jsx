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
import Moves from "../strength/moves.json";
import { useEffect } from "react";

/*
the types are: pull, push, lower push, lower pull, balance, upper push, upper pull, unilateral lower push, unilateral lower pull, iso push, iso pull
*/
const Block = (props) => {

  const blockType = props.typeOfBlock;
  const blockIndex = props.blockIndex;
  const moveSelected = props.exerciseChosen;
  const history = useHistory();
  const movements = {};
  // Maybe this should be a state?
  let filteredMoves;
  useEffect(() => {}, []);

  var content = [];
  function processMovements() {

    blockType.map((exercise, index) => {
      console.log("DEBUGGING STARTS", exercise);
      if (exercise.includes("pull")){
        filteredMoves = Moves.moves.filter((obj) => {
          return obj.type === "pull";
        });
        if (exercise.includes("upper")){
          filteredMoves = Moves.moves.filter((obj) => {
            return obj.area === "upper";
          });
          movements.upperBody = [];
          movements.fullBody = filteredMoves;
          movements.fullBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
          movements.lowerBody = [];
        } else if (exercise.includes("lower")){
          filteredMoves = Moves.moves.filter((obj) => {
            return obj.area === "lower";
          });
          movements.upperBody = [];
          movements.fullBody = filteredMoves;
          movements.fullBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
          movements.lowerBody = [];
        } else if (exercise.includes("iso")){
          filteredMoves = Moves.moves.filter((obj) => {
            return obj.technique === "isolateral";
          });
          movements.upperBody = filteredMoves.filter((obj) => {
            return obj.area === "upper";
          });
          movements.upperBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
          movements.fullBody = filteredMoves.filter((obj) => {
            return obj.area === "full";
          });
          movements.fullBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
          movements.lowerBody = filteredMoves.filter((obj) => {
            return obj.area === "lower";
          });
          movements.lowerBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
        } else {
          movements.upperBody = filteredMoves.filter((obj) => {
            return obj.area === "upper";
          });
          movements.upperBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
          movements.fullBody = filteredMoves.filter((obj) => {
            return obj.area === "full";
          });
          movements.fullBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
          movements.lowerBody = filteredMoves.filter((obj) => {
            return obj.area === "lower";
          });
          movements.lowerBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
        }
      } else if (exercise.includes("push")){
        console.log("it should include push");
        filteredMoves = Moves.moves.filter((obj) => {
          return obj.type === "push";
        });
        console.log("push moves", filteredMoves);
        if (exercise.includes("upper")){
          filteredMoves = Moves.moves.filter((obj) => {
            return obj.area === "upper";
          });
          movements.upperBody = [];
          movements.fullBody = filteredMoves;
          movements.fullBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
          movements.lowerBody = [];
        } else if (exercise.includes("lower")){
          filteredMoves = Moves.moves.filter((obj) => {
            return obj.area === "lower";
          });
          movements.upperBody = [];
          movements.fullBody = filteredMoves;
          movements.fullBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
          movements.lowerBody = [];
        } else if (exercise.includes("iso")){
          filteredMoves = Moves.moves.filter((obj) => {
            return obj.technique === "isolateral";
          });
          movements.upperBody = filteredMoves.filter((obj) => {
            return obj.area === "upper";
          });
          movements.upperBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
          movements.fullBody = filteredMoves.filter((obj) => {
            return obj.area === "full";
          });
          movements.fullBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
          movements.lowerBody = filteredMoves.filter((obj) => {
            return obj.area === "lower";
          });
          movements.lowerBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
        } else {
          movements.upperBody = filteredMoves.filter((obj) => {
            return obj.area === "upper";
          });
          movements.upperBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
          movements.fullBody = filteredMoves.filter((obj) => {
            return obj.area === "full";
          });
          movements.fullBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
          movements.lowerBody = filteredMoves.filter((obj) => {
            return obj.area === "lower";
          });
          movements.lowerBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
        }
      } else { //TODO: is balance
        filteredMoves = Moves.moves.filter((obj) => {
          return obj.technique === "isolateral";
        });
        movements.upperBody = filteredMoves.filter((obj) => {
          return obj.area === "upper";
        });
        movements.upperBody.sort((a, b) => {
          return a.progressionLevel - b.progressionLevel;
        });
        movements.fullBody = filteredMoves.filter((obj) => {
          return obj.area === "full";
        });
        movements.fullBody.sort((a, b) => {
          return a.progressionLevel - b.progressionLevel;
        });
        movements.lowerBody = filteredMoves.filter((obj) => {
          return obj.area === "lower";
        });
        movements.lowerBody.sort((a, b) => {
          return a.progressionLevel - b.progressionLevel;
        });
      }
      content.push(
        <IonButton
          className="block-button"
          onClick={(event) => {
            history.push({
              pathname: "/box/move/movement-picker",
              state: {
                movements: movements,
                blockIndex: blockIndex,
                initialSlideIndex: {
                  upperBody: 0,
                  fullBody: 0,
                  lowerBody: 0,
                },
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
      );
    })

  }
  processMovements();
  return (
    <IonCard>
      <IonCardHeader className="block-header">
        <IonCardTitle>Block {blockIndex + 1}</IonCardTitle>
        <IonCardSubtitle className="block-header-filter">
          {blockType}
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        {content}
      </IonCardContent>
    </IonCard>
  );
};

export default Block;
