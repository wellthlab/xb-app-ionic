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
import { getMove } from "../../DEPRECATED/components/OLDMovementPicker";
import { CropLandscapeOutlined } from "@material-ui/icons";

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
  useEffect(() => { }, []);

  var content = [];
  function processMovements() {
    blockType.map((exercise, index) => {
      exercise = exercise.split(" ").join("+"); 
      const movements = {};
      var movesForweek = Moves.moves.filter((obj) => {
        return obj.weekToApper > 0 && obj.weekToApper <= weekNo;
      });
      if (props.explorer) filteredMoves = Moves.moves;
      if (exercise.includes("bilateral")) {
        filteredMoves = movesForweek.filter((obj) => {
          return obj.technique === "bilateral";
        });
      } else if (exercise.includes("isolateral")) {
        filteredMoves = movesForweek.filter((obj) => {
          return obj.technique === "isolateral";
        });
      } else if (exercise.includes("balance")) {

        if (exercise.includes("assessment")) { //is balance assessment
            filteredMoves = movesForweek.filter((obj) => {
              return obj.type === "assessment";
            });
        } else { //is balance practice
            filteredMoves = movesForweek.filter((obj) => {
              return obj.type === "practice";
            });
        }
      } 


      if (exercise.includes("pull")) {
        filteredMoves = filteredMoves.filter((obj) => {
          return obj.type === "pull";
        });
      } else if (exercise.includes("push")) {
        filteredMoves = filteredMoves.filter((obj) => {
          return obj.type === "push";
        });
      } 
      var upperBody = [];
      var fullBody = [];
      var lowerBody = [];

      if (exercise.includes("upper")) {
        upperBody = filteredMoves.filter((obj) => {
          return obj.area === "upper";
        });
        if (upperBody.length != 0) upperBody.sort((a, b) => {
          return a.progressionLevel - b.progressionLevel;
        });
      } else if (exercise.includes("full")) {
        fullBody = filteredMoves.filter((obj) => {
          return obj.area === "full";
        });
        if (fullBody.length != 0) fullBody.sort((a, b) => {
          return a.progressionLevel - b.progressionLevel;
        });

      } else if (exercise.includes("lower")) {
        lowerBody = filteredMoves.filter((obj) => {
          return obj.area === "lower";
        });
        if (lowerBody.length != 0) lowerBody.sort((a, b) => {
          return a.progressionLevel - b.progressionLevel;
        });
      } else if (exercise.includes("isolateral")){ 
        upperBody = filteredMoves.filter((obj) => {
          return obj.area === "upper";
        });
        if (upperBody.length != 0) upperBody.sort((a, b) => {
          return a.progressionLevel - b.progressionLevel;
        });
        fullBody = filteredMoves.filter((obj) => {
          return obj.area === "full";
        });
        if (fullBody.length != 0) fullBody.sort((a, b) => {
          return a.progressionLevel - b.progressionLevel;
        });
        lowerBody = filteredMoves.filter((obj) => {
          return obj.area === "lower";
        });
        if (lowerBody.length != 0) lowerBody.sort((a, b) => {
          return a.progressionLevel - b.progressionLevel;
        });
      } else { //something else, i.e. explorer/bilateral push
        upperBody = filteredMoves.filter((obj) => {
          return obj.area === "upper";
        });
        if (upperBody.length != 0) upperBody.sort((a, b) => {
          return a.progressionLevel - b.progressionLevel;
        });
        lowerBody = filteredMoves.filter((obj) => {
          return obj.area === "lower";
        });
        if (lowerBody.length != 0) lowerBody.sort((a, b) => {
          return a.progressionLevel - b.progressionLevel;
        });
        fullBody = filteredMoves.filter((obj) => {
          return obj.area === "full";
        });
        if (fullBody.length != 0) fullBody.sort((a, b) => {
          return a.progressionLevel - b.progressionLevel;
        });
      }
      if (!props.explorer){
      lowerBody = removeAlternativesWhichDontfit(lowerBody);
      fullBody = removeAlternativesWhichDontfit(fullBody);
      upperBody = removeAlternativesWhichDontfit(upperBody);
      }
      movements.lowerBody = lowerBody;
      movements.fullBody = fullBody;
      movements.upperBody = upperBody;

      function removeAlternativesWhichDontfit(moves){
        for (var i=0; i<moves.length; i++){
          var move = moves[i];
          var alternatives = move.alternative;
          var newAlternatives = [];
          if (alternatives.length > 0){ //if there are alternatives
            for (var k=0; k<alternatives.length; k++){ //going through each alternative
              if (alternativeIsGood(alternatives[k])) newAlternatives.push(alternatives[k]);
            }
            //update alternatives
            moves[i].alternative = newAlternatives;
          }
        }
        return moves;
      }

      function alternativeIsGood(id){
        var move = getMove(id);
        if (move.weekToApper < 0) return false;
        if (move.blockToApperIn[weekNo] < 0) return false;
        return true;
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
                exercise,
              state: {
                movements: movements,
                blockIndex: blockIndex,
                initialSlideIndex: {
                  upperBody: 0,
                  fullBody: 0,
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
