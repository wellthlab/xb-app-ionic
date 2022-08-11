import React from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from "@ionic/react";
import { uniqBy } from "lodash";

import "./Block.css";

import Moves from "../../Strength/moves.json";
import MovementPicker from "../MovementPicker";
import { codeSlashOutline } from "ionicons/icons";

var getMove = function (id) {
  var idToUse = id;
  for (var i in Moves.moves) {
    var m = Moves.moves[i];

    if (m.id === idToUse) {
      return m;
    }
  }

  return false;
};

function removeAlternativesWhichDontfit(moves, weekNo) {
  if (moves.length === 0) return moves;

  for (var i = 0; i < moves.length; i++) {
    var move = moves[i];
    var alternatives = move.alternative;
    var newAlternatives = [];
    if (alternatives.length > 0) {
      //if there are alternatives
      for (var k = 0; k < alternatives.length; k++) {
        //going through each alternative
        if (alternativeIsGood(alternatives[k], weekNo))
          newAlternatives.push(alternatives[k]);
      }
      //update alternatives
      moves[i].alternative = newAlternatives;
    }
  }
  return moves;
}

function alternativeIsGood(id, weekNo) {
  var move = getMove(id);
  if (move.weekToApper < 0) return false;
  if (move.blockToApperIn[weekNo] < 0) return false;
  return true;
}

function filterMovesByTechnique(exercise, movesForWeek) {
  let filteredMovesTechnique = [];
  let filteredMovesArea = [];

  if (exercise.includes("bilateral")) {
    filteredMovesTechnique = movesForWeek.filter((obj) => {
      return obj.technique === "bilateral";
    });
  } else if (exercise.includes("isolateral")) {
    filteredMovesTechnique = movesForWeek.filter((obj) => {
      return obj.technique === "isolateral";
    });
  } else if (exercise.includes("balance")) {
    return (filteredMovesTechnique = movesForWeek.filter((obj) => {
      return obj.technique === "balance";
    }));
    // console.log("balance", filteredMovesTechnique);
    // if (exercise.includes("assessment")) {
    //   //is balance assessment
    //   filteredMovesTechnique = movesForWeek.filter((obj) => {
    //     return obj.type === "assessment";
    //   });
    // } else {
    //   //is balance practice
    //   filteredMovesTechnique = movesForWeek.filter((obj) => {
    //     return obj.type === "practice";
    //   });
    // }
  }

  if (filteredMovesTechnique.length === 0) {
    filteredMovesTechnique = movesForWeek;
  }

  if (exercise.includes("pull")) {
    filteredMovesArea = filteredMovesTechnique.filter((obj) => {
      return obj.type === "pull";
    });
  } else if (exercise.includes("push")) {
    filteredMovesArea = filteredMovesTechnique.filter((obj) => {
      return obj.type === "push";
    });
  } else if (exercise.includes("full")) {
    filteredMovesArea = filteredMovesTechnique.filter((obj) => {
      return obj.type === "full";
    });
  }

  return filteredMovesArea;
}

function filterMovesByArea(exercise, filteredMoves) {
  let lowerBody = [];
  let upperBody = [];
  let fullBody = [];

  if (exercise.includes("upper")) {
    upperBody = filteredMoves.filter((obj) => {
      return obj.area === "upper";
    });
    if (upperBody.length != 0)
      upperBody.sort((a, b) => {
        return a.progressionLevel - b.progressionLevel;
      });
  } else if (exercise.includes("full")) {
    fullBody = filteredMoves.filter((obj) => {
      return obj.area === "full";
    });
    if (fullBody.length != 0)
      fullBody.sort((a, b) => {
        return a.progressionLevel - b.progressionLevel;
      });
  } else if (exercise.includes("lower")) {
    lowerBody = filteredMoves.filter((obj) => {
      return obj.area === "lower";
    });
    if (lowerBody.length != 0)
      lowerBody.sort((a, b) => {
        return a.progressionLevel - b.progressionLevel;
      });
  } else if (exercise.includes("isolateral")) {
    upperBody = filteredMoves.filter((obj) => {
      return obj.area === "upper";
    });
    if (upperBody.length != 0)
      upperBody.sort((a, b) => {
        return a.progressionLevel - b.progressionLevel;
      });
    fullBody = filteredMoves.filter((obj) => {
      return obj.area === "full";
    });
    if (fullBody.length != 0)
      fullBody.sort((a, b) => {
        return a.progressionLevel - b.progressionLevel;
      });
    lowerBody = filteredMoves.filter((obj) => {
      return obj.area === "lower";
    });
    if (lowerBody.length != 0)
      lowerBody.sort((a, b) => {
        return a.progressionLevel - b.progressionLevel;
      });
  } else {
    //something else, i.e. explorer/bilateral push/aerobic
    upperBody = filteredMoves.filter((obj) => {
      return obj.area === "upper";
    });

    if (upperBody.length != 0) {
      upperBody.sort((a, b) => {
        return a.progressionLevel - b.progressionLevel;
      });
    }

    lowerBody = filteredMoves.filter((obj) => {
      return obj.area === "lower";
    });

    if (lowerBody.length != 0) {
      lowerBody.sort((a, b) => {
        return a.progressionLevel - b.progressionLevel;
      });
    }

    fullBody = filteredMoves.filter((obj) => {
      return obj.area === "full";
    });

    if (fullBody.length != 0) {
      fullBody.sort((a, b) => {
        return a.progressionLevel - b.progressionLevel;
      });
    }
  }

  return {
    upperBody: upperBody,
    lowerBody: lowerBody,
    fullBody: fullBody,
  };
}

/*
the types are: pull, push, lower push, lower pull, balance, upper push, upper pull, unilateral lower push, unilateral lower pull, iso push, iso pull
*/
const Block = (props) => {
  const blockType = props.typeOfBlock;
  const blockIndex = props.blockIndex;
  const moveSelected = props.exerciseChosen; // would be {push: "no move", pull: "nomove"}
  const weekNum = props.week;

  let filteredMoves;

  const content = blockType.map((exercise, index) => {
    const thisExercise = exercise.split(" ").join("+");
    const movements = {};

    // TODO: need to limit moves by week, or something
    // let movesAvailable = Moves.moves.filter((obj) => {
    //   return obj.weekToAppear > 0 && obj.weekToAppear <= weekNum;
    // });
    let movesAvailable = Moves.moves;

    if (props.explorer) {
      movesAvailable = Moves.moves;
    }

    filteredMoves = filterMovesByTechnique(thisExercise, movesAvailable);
    filteredMoves = filterMovesByArea(thisExercise, filteredMoves);
    let { upperBody, fullBody, lowerBody } = filteredMoves;

    // let upperBody = filteredMoves.upperBody;
    // let fullBody = filteredMoves.fullBody;
    // let lowerBody = filteredMoves.lowerBody;

    if (!props.explorer) {
      lowerBody = removeAlternativesWhichDontfit(lowerBody, weekNum);
      fullBody = removeAlternativesWhichDontfit(fullBody, weekNum);
      upperBody = removeAlternativesWhichDontfit(upperBody, weekNum);
    }

    movements.lowerBody = lowerBody;
    movements.fullBody = fullBody;
    movements.upperBody = upperBody;

    // TODO: some things don't have unique keys
    const buttonKey = index + 2 * blockIndex;

    // safety measure
    if (!exercise.includes("+")) {
      exercise = exercise.replaceAll(" ", "+");
    }

    return (
      <>
        <IonButton
          key={buttonKey}
          className="block-button"
          onClick={() => {
            const content = (
              <MovementPicker
                explorer={props.explorer}
                typeOfExercise={exercise}
                movements={movements}
                blockIndex={blockIndex}
                initialSlideIndex={{ upperBody: 0, lowerBody: 0, fullBody: 0 }}
                numberOfItems={{
                  topRow: movements.upperBody.length,
                  middleRow: movements.fullBody.length,
                  bottomRow: movements.lowerBody.length,
                }}
                setContent={props.setContent}
                updateExercise={props.updateExercise}
              />
            );

            props.setContent(content);
          }}
        >
          {props.explorer ? (
            <p>Explore {exercise.replaceAll("+", " ")}</p>
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
      </>
    );
  });

  return (
    <IonCard>
      <IonCardHeader>
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
