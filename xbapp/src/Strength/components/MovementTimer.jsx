import React, { useState, useEffect } from "react";
import { IonRow, IonCard, IonGrid, IonCol, IonCardContent } from "@ionic/react";
import { useHistory } from "react-router";
import Blur from "react-css-blur";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./MovementTimer.scss";
import CountDown from "../../Instruments/CountDown";
import MovementInfoCard from "../MovementInfoCard";
import SetCounter from "../SetCounter";

/**
 * Time movements
 */
const EDTMovementTimer = ({ exercises, block, onSubmit, mins, secs, day }) => {
  if (!mins) var mins = 0;
  if (!secs) var secs = 0;

  let history = useHistory();
  const [moveAlternation, setMoveAlternation] = React.useState([null, null]);
  const [numberOfSets, setNumberOfSets] = React.useState(0);
  const [numberOfReps, setNumberOfReps] = React.useState(0);
  const [showReps, setShowReps] = React.useState(false);
  const [timerOn, setTimerOn] = React.useState(false);

  function resetTimer() {
    setMoveAlternation([null, null]);
    setShowReps(false);
    setTimerOn(false);
  }

  function alternate(key) {
    if (moveAlternation[0] == null) {
      setNumberOfSets(0);
      var updated = [false, false];
      updated[key] = true;
      setMoveAlternation(updated);
      setTimerOn(true);
      setShowReps(false);
    } else {
      var updated = [!moveAlternation[0], !moveAlternation[1]];
      setMoveAlternation(updated);
      setNumberOfSets(numberOfSets + 1);
      toast("You added 1 SET. Keep going!", {
        position: moveAlternation[0] === false ? "bottom-right" : "bottom-left",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    }
  }

  function timerFinished() {
    onSubmit({ minutes: 7, sets: numberOfSets, reps: numberOfReps });
    setShowReps(true);
    setMoveAlternation([null, null]);
  }

  return (
    <div id="movementTimer">
      <IonRow>
        <IonCol>
          <IonCard>
            <IonCardContent>
              Try to fit in as many sets in the 7-minute limit. When ready, TAP
              on the move you want to start with. Tap AGAIN when you have
              completed 5 REPS and you will switch moves. When the time runs
              out, you can add any outstanding reps.
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>

      {mins === 0 && secs === 0 ? (
        ""
      ) : (
        <CountDown
          minutes={mins}
          timerName={"day-" + day}
          onFinish={() => {
            timerFinished();
          }}
          timerOn={timerOn}
          resetTimer={resetTimer}
          isExerciseTimer={true}
        />
      )}

      <IonGrid>
        <IonRow>
          {Object.entries(exercises).length > 1 ? (
            Object.entries(exercises).map(([type, exercise], key) => {
              return (
                <IonCol
                  style={{
                    borderStyle:
                      moveAlternation[key] === false ? "hidden" : "solid",
                    borderColor: "blue",
                    borderWidth: "1px",
                  }}
                  onClick={() => alternate(key)}
                >
                  <Blur
                    radius={moveAlternation[key] !== false ? "0px" : "5px"}
                    transition="400ms"
                  >
                    <div>
                      <MovementInfoCard
                        accordion={false}
                        titleSize={"small"}
                        key={exercise}
                        images={exercise.images}
                        name={exercise.name}
                      ></MovementInfoCard>
                    </div>
                  </Blur>
                </IonCol>
              );
            })
          ) : (
            <>
              <IonCol
                style={{
                  borderStyle:
                    moveAlternation[0] === false ? "hidden" : "solid",
                  borderColor: "blue",
                  borderWidth: "1px",
                }}
                onClick={() => alternate(0)}
              >
                <Blur
                  radius={moveAlternation[0] !== false ? "0px" : "5px"}
                  transition="400ms"
                >
                  <div>
                    <MovementInfoCard
                      accordion={false}
                      titleSize={"small"}
                      key={Object.entries(exercises)[0][1]}
                      images={Object.entries(exercises)[0][1].images}
                      name={
                        Object.entries(exercises)[0][1].name + " - left side"
                      }
                    ></MovementInfoCard>
                  </div>
                </Blur>
              </IonCol>
              <IonCol
                style={{
                  borderStyle:
                    moveAlternation[1] === false ? "hidden" : "solid",
                  borderColor: "blue",
                  borderWidth: "1px",
                }}
                onClick={() => alternate(1)}
              >
                <Blur
                  radius={moveAlternation[1] !== false ? "0px" : "5px"}
                  transition="400ms"
                >
                  <div>
                    <MovementInfoCard
                      accordion={false}
                      titleSize={"small"}
                      key={Object.entries(exercises)[0][1]}
                      images={Object.entries(exercises)[0][1].images}
                      name={
                        Object.entries(exercises)[0][1].name + " - right side"
                      }
                    ></MovementInfoCard>
                  </div>
                </Blur>
              </IonCol>
            </>
          )}
          {}
        </IonRow>
      </IonGrid>
      {showReps ? (
        <SetCounter
          showReps={showReps}
          sets={numberOfSets}
          onChange={(sets, reps) => {
            setNumberOfReps(reps);
            setNumberOfSets(sets);
            onSubmit({ minutes: 7, sets: sets, reps: reps });
          }}
        />
      ) : (
        ""
      )}

      <ToastContainer
        position={moveAlternation[0] === false ? "bottom-right" : "bottom-left"}
        autoClose={1500}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default EDTMovementTimer;
