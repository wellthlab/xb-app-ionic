import {
  IonBackButton,
  IonButton,
  IonLabel,
  IonList,
  IonItem,
  IonInput,
  IonTitle,
} from "@ionic/react";
import React, { Component } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Timer, { resetTimer } from "../Instruments/Timer";


const WallSit = (props) => {
  useEffect(() => {}, []);
  const history = useHistory();

  const [wallTime, setWallTime] = React.useState(null);
  //expecting week to be passed as prop
  let week = props.week;

  return (
    <>
    <h3>Wall Sit</h3>
        <p>The wall sit assesses leg strength.</p>
        <p>
          Put your back against the wall, with your feet a thigh's-length in
          front of you. Slide your back down the wall until you are in a sitting
          position, with your thighs parallel to the floor.
        </p>
        <p>Time how long you can hold that position.</p>
        <p>
          If you can't get your thighs parallel with the floor, that's no
          problem. Note how low you can get; and don't worry about timing
          yourself.
        </p>
        <Timer onStop={setWallTime} />
    <IonButton
          onClick={function () {
            var res = {};
            res.wallTime = wallTime;
            res.type = "wallsit";
            props.onSubmit(res);
          }}
        >
          Submit
        </IonButton>

  </>

  );
};

export default WallSit;
