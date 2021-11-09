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
import Moves from "../../Strength/moves.json";
import { useEffect } from "react";

/*
the types are: pull, push, lower push, lower pull, balance, upper push, upper pull, unilateral lower push, unilateral lower pull, iso push, iso pull
*/
const Block = (props) => {
  const blockType = props.typeOfBlock;
  const blockIndex = props.blockIndex;
  const moveSelected = props.exerciseChosen; // would be {push: "no move", pull: "nomove"}
  const weekNo = props.week;
  
  const history = useHistory();

  // Maybe this should be a state?
 
  let filteredMoves;
  useEffect(() => {}, []);

  var content = [];
  function processMovements() {
    blockType.map((exercise, index) => {
      const movements = {};
      //extraordinary flow
       //TODO: NOT HARD CODE
       var starter = 0;
      if (weekNo == 2){ //HARDCODED
        var movesForweek1 = Moves.moves.filter((obj) => {
          return obj.weekToApper == 1;
        });
        if (exercise.includes("pull")) {
          filteredMoves = movesForweek1.filter((obj) => {
            return obj.type === "pull";
          });
            movements.upperBody = [];
            movements.fullBody = filteredMoves.sort((a, b) => {
              return a.order - b.order;
            });
            
            movements.lowerBody = [];
            starter = 5;
          
        } else if (exercise.includes("push")) {
          filteredMoves = movesForweek1.filter((obj) => {
            return obj.type === "push";
          });
          
          movements.upperBody = [];
          movements.fullBody = filteredMoves.sort((a, b) => {
            return a.order - b.order;
          });
          
          movements.lowerBody = [];
          starter = 1;
        }
      
      } else {

      // normal flow
      if (exercise.includes("pull")) {
        filteredMoves = Moves.moves.filter((obj) => {
          return obj.type === "pull";
        });
        if (exercise.includes("upper")) {
          filteredMoves = Moves.moves.filter((obj) => {
            return obj.area === "upper";
          });
          movements.upperBody = [];
          movements.fullBody = filteredMoves;
          movements.fullBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
          movements.lowerBody = [];
        } else if (exercise.includes("lower")) {
          filteredMoves = Moves.moves.filter((obj) => {
            return obj.area === "lower";
          });
          movements.upperBody = [];
          movements.fullBody = filteredMoves;
          movements.fullBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
          movements.lowerBody = [];
        } else if (exercise.includes("iso")) {
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
      } else if (exercise.includes("push")) {
        filteredMoves = Moves.moves.filter((obj) => {
          return obj.type === "push";
        });
        if (exercise.includes("upper")) {
          filteredMoves = Moves.moves.filter((obj) => {
            return obj.area === "upper";
          });
          movements.upperBody = [];
          movements.fullBody = filteredMoves;
          movements.fullBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
          movements.lowerBody = [];
        } else if (exercise.includes("lower")) {
          filteredMoves = Moves.moves.filter((obj) => {
            return obj.area === "lower";
          });
          movements.upperBody = [];
          movements.fullBody = filteredMoves;
          movements.fullBody.sort((a, b) => {
            return a.progressionLevel - b.progressionLevel;
          });
          movements.lowerBody = [];
        } else if (exercise.includes("iso")) {
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
      } else {
        //TODO: is balance
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
      }

      content.push(
        <IonButton
          className="block-button"
          onClick={(event) => {
            history.push({
              pathname:
                "/box/move/" +
                (props.explorer ? "explore" : "setter") +
                "/movement-picker/" +
                exercise.split(" ").join("+"),
              state: {
                movements: movements,
                blockIndex: blockIndex,
                initialSlideIndex: {
                  upperBody: 0,
                  fullBody: starter,
                  lowerBody: 0,
                },
                numberOfItems: {
                  topRow: movements.upperBody.length,
                  middleRow: movements.fullBody.length,
                  bottomRow: movements.lowerBody.length
                }
              },
            });
          }}
        >
          {props.explorer ? (
            <p>Explore {exercise}</p>
          ) : (
            <div className="block-button-container">
              <div className="container-left">
                <p id="move-selected">
                  {moveSelected[exercise].name.split("+").join(" ")}
                </p>
              </div>
              <div className="container-right">
                <p id="select-text">Select {">"}</p>
              </div>
            </div>
          )}
        </IonButton>
      );
    });
  }
  processMovements();
  return (
    <IonCard>
      <IonCardHeader className="block-header">
        <IonCardTitle>
          Block {props.explorer ? "Explorer" : blockIndex + 1}
        </IonCardTitle>
        <IonCardSubtitle className="block-header-filter">
          Block type: {blockType.join("-")}
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>{content}</IonCardContent>
    </IonCard>
  );
};

export default Block;
