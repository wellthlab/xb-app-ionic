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

  console.log("YEST", blockType, moveSelected);
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
      if (exercise.includes("bilateral")) {
        filteredMoves = movesForweek.filter((obj) => {
          return obj.technique === "bilateral";
        });
      } else if (exercise.includes("isolateral")) {
        filteredMoves = movesForweek.filter((obj) => {
          return obj.technique === "isolateral";
        });
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
      } else { //it's just "isolateral"
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
      }
      movements.lowerBody = lowerBody;
      movements.fullBody = fullBody;
      movements.upperBody = upperBody;

      // if (exercise.includes("pull")) {
      //   filteredMoves = movesForweek.filter((obj) => {
      //     return obj.type === "pull";
      //   });
      //   movements.upperBody = filteredMoves.filter((obj) => {
      //           return obj.area === "upper";
      //         });

      // } else if (exercise.includes("push")) {
      //   filteredMoves = movesForweek.filter((obj) => {
      //     return obj.type === "push";
      //   });

      // }

      // movements.upperBody = filteredMoves.filter((obj) => {
      //   return obj.area === "upper";
      // });
      // movements.upperBody.sort((a, b) => {
      //   return a.progressionLevel - b.progressionLevel;
      // });
      // movements.fullBody = filteredMoves.filter((obj) => {
      //   return obj.area === "full";
      // });
      // movements.fullBody.sort((a, b) => {
      //   return a.progressionLevel - b.progressionLevel;
      // });
      // movements.lowerBody = filteredMoves.filter((obj) => {
      //   return obj.area === "lower";
      // });
      // movements.lowerBody.sort((a, b) => {
      //   return a.progressionLevel - b.progressionLevel;
      // });

      // } else {

      // // normal flow


      //     filteredMoves = Moves.moves.filter((obj) => {
      //       return obj.technique === "isolateral";
      //     });
      //     movements.upperBody = filteredMoves.filter((obj) => {
      //       return obj.area === "upper";
      //     });
      //     movements.upperBody.sort((a, b) => {
      //       return a.progressionLevel - b.progressionLevel;
      //     });
      //     movements.fullBody = filteredMoves.filter((obj) => {
      //       return obj.area === "full";
      //     });
      //     movements.fullBody.sort((a, b) => {
      //       return a.progressionLevel - b.progressionLevel;
      //     });
      //     movements.lowerBody = filteredMoves.filter((obj) => {
      //       return obj.area === "lower";
      //     });
      //     movements.lowerBody.sort((a, b) => {
      //       return a.progressionLevel - b.progressionLevel;
      //     });
      //   } else {
      //     movements.upperBody = filteredMoves.filter((obj) => {
      //       return obj.area === "upper";
      //     });
      //     movements.upperBody.sort((a, b) => {
      //       return a.progressionLevel - b.progressionLevel;
      //     });
      //     movements.fullBody = filteredMoves.filter((obj) => {
      //       return obj.area === "full";
      //     });
      //     movements.fullBody.sort((a, b) => {
      //       return a.progressionLevel - b.progressionLevel;
      //     });
      //     movements.lowerBody = filteredMoves.filter((obj) => {
      //       return obj.area === "lower";
      //     });
      //     movements.lowerBody.sort((a, b) => {
      //       return a.progressionLevel - b.progressionLevel;
      //     });
      //   }
      // } else if (exercise.includes("push")) {
      //   filteredMoves = Moves.moves.filter((obj) => {
      //     return obj.type === "push";
      //   });
      //   if (exercise.includes("upper")) {
      //     filteredMoves = Moves.moves.filter((obj) => {
      //       return obj.area === "upper";
      //     });
      //     movements.upperBody = [];
      //     movements.fullBody = filteredMoves;
      //     movements.fullBody.sort((a, b) => {
      //       return a.progressionLevel - b.progressionLevel;
      //     });
      //     movements.lowerBody = [];
      //   } else if (exercise.includes("lower")) {
      //     filteredMoves = Moves.moves.filter((obj) => {
      //       return obj.area === "lower";
      //     });
      //     movements.upperBody = [];
      //     movements.fullBody = filteredMoves;
      //     movements.fullBody.sort((a, b) => {
      //       return a.progressionLevel - b.progressionLevel;
      //     });
      //     movements.lowerBody = [];
      //   } else if (exercise.includes("iso")) {
      //     filteredMoves = Moves.moves.filter((obj) => {
      //       return obj.technique === "isolateral";
      //     });
      //     movements.upperBody = filteredMoves.filter((obj) => {
      //       return obj.area === "upper";
      //     });
      //     movements.upperBody.sort((a, b) => {
      //       return a.progressionLevel - b.progressionLevel;
      //     });
      //     movements.fullBody = filteredMoves.filter((obj) => {
      //       return obj.area === "full";
      //     });
      //     movements.fullBody.sort((a, b) => {
      //       return a.progressionLevel - b.progressionLevel;
      //     });
      //     movements.lowerBody = filteredMoves.filter((obj) => {
      //       return obj.area === "lower";
      //     });
      //     movements.lowerBody.sort((a, b) => {
      //       return a.progressionLevel - b.progressionLevel;
      //     });
      //   } else {
      //     movements.upperBody = filteredMoves.filter((obj) => {
      //       return obj.area === "upper";
      //     });
      //     movements.upperBody.sort((a, b) => {
      //       return a.progressionLevel - b.progressionLevel;
      //     });
      //     movements.fullBody = filteredMoves.filter((obj) => {
      //       return obj.area === "full";
      //     });
      //     movements.fullBody.sort((a, b) => {
      //       return a.progressionLevel - b.progressionLevel;
      //     });
      //     movements.lowerBody = filteredMoves.filter((obj) => {
      //       return obj.area === "lower";
      //     });
      //     movements.lowerBody.sort((a, b) => {
      //       return a.progressionLevel - b.progressionLevel;
      //     });
      //   }
      // } else {
      //   //TODO: is balance
      //   filteredMoves = Moves.moves.filter((obj) => {
      //     return obj.technique === "isolateral";
      //   });
      //   movements.upperBody = filteredMoves.filter((obj) => {
      //     return obj.area === "upper";
      //   });
      //   movements.upperBody.sort((a, b) => {
      //     return a.progressionLevel - b.progressionLevel;
      //   });
      //   movements.fullBody = filteredMoves.filter((obj) => {
      //     return obj.area === "full";
      //   });
      //   movements.fullBody.sort((a, b) => {
      //     return a.progressionLevel - b.progressionLevel;
      //   });
      //   movements.lowerBody = filteredMoves.filter((obj) => {
      //     return obj.area === "lower";
      //   });
      //   movements.lowerBody.sort((a, b) => {
      //     return a.progressionLevel - b.progressionLevel;
      //   });
      // }
      // }

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
