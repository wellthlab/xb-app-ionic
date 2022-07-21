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
import Timer, { resetTimer } from "../Instruments/Timer";

const Plank = (props) => {
  useEffect(() => {}, []);

  const [plankTime, setPlankTime] = React.useState(null);
  //expecting week to be passed as prop
  let week = props.week;

  return (
    <>
      <h3>Plank</h3>
      <p>
        The plank engages lots of muscles, so is a good measure of general
        strength.
      </p>
      <p>
        Lay on the floor, and raise your upper body on to your elbows, so that
        they're directly below your shoulders. Make fists with your hands, and
        leave them on the floor.
      </p>
      <p>
        Now raise your bottom towards the ceiling, taking your knees off of the
        floor. Your body should be fairly straight, don't let your bottom sag
        downwards! Your head should be neutral, so you're looking down at the
        floor.
      </p>
      <p>Time how long you can hold that position. 60 seconds maximum!</p>
      <p>
        If you can't get into this form right now, that's fine. Make a note of
        how close you got, and where the challenges are.
      </p>
      <Timer onStop={(seconds) => setPlankTime(seconds)} />
      <IonButton
        onClick={function () {
          var res = {};
          res.plankTime = plankTime;
          res.type = "plank";
          props.onSubmit(res);
        }}
      >
        Submit
      </IonButton>
    </>
  );
};

export default Plank;
