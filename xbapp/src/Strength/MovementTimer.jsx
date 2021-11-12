import React, { useState, useEffect } from "react";

import {
  IonButton,
  IonItem,
  IonLabel,
  IonRow,
  IonGrid,
  IonCol,
} from "@ionic/react";

import { connect } from "react-redux";
import CountDown from "../Instruments/CountDown";
import MovementInfoCard from "./MovementInfoCard";
import SetCounter from "./SetCounter";

import { moves, getMove } from "../DEPRECATED/components/OLDMovementPicker";
import "./MovementTimer.scss";
import { AlternateEmail } from "@material-ui/icons";

import Blur from 'react-css-blur'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Time movements
 */
const MovementTimer = ({
  exercises,
  block,
  onSetChange,
  onDone,
  mins,
  day,
}) => {
  if (!mins) var mins = 0;
  if (!secs) var secs = 0;

  const [moveAlternation, setMoveAlternation] = React.useState([null, null]);
  const [numberOfSets, setNumberOfSets] = React.useState(0);
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
      var newSets = numberOfSets;
      newSets++;
      setNumberOfSets(newSets);
      toast('You added 1 SET. Keep going!', {
        position: moveAlternation[0] == false ? "bottom-right" : "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
        onSetChange(exercises, block, newSets*5);
    }
  }


  function timerFinished(){
    onDone(); 
    setShowReps(true); 
    setMoveAlternation([null, null]);
  }
  return (
    <div id="movementTimer">

      {mins == 0 && secs == 0 ? (
        ""
      ) : (
        <CountDown minutes={mins} timerName={"day-" + day} onFinish={() => {timerFinished()}} timerOn={timerOn} resetTimer={resetTimer} isExerciseTimer={true} />
      )}

      <IonGrid>
        <IonRow>
          {Object.entries(exercises).map(([type, exercise], key) => {
            return (

              <IonCol style={{ borderStyle: moveAlternation[key] == false ? "hidden" : "solid", borderColor: "blue", borderWidth: "1px" }} onClick={() => alternate(key)}>
                <Blur radius={moveAlternation[key] != false ? '0px' : '5px'} transition="400ms">
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

            )
          })}
        </IonRow>
      </IonGrid>
      {showReps == false ? <IonRow>
        <IonLabel>Total: {numberOfSets} sets</IonLabel>
      </IonRow> : <></>}
      <SetCounter
        showReps={showReps}
        sets={numberOfSets}
        onChange={(reps) => {
          onSetChange(exercises, block, reps);
        }}
      />
      <ToastContainer
        position={moveAlternation[0] == false ? "bottom-right" : "bottom-left"}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      </div>
  );
};

export default MovementTimer;
