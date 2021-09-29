import React, { useState, useEffect } from "react";
import { IonButton, IonIcon, IonInput, IonTitle } from "@ionic/react";
import { connect } from "react-redux";
import CountDown from "../instruments/CountDown";

import { CountdownCircleTimer } from "react-countdown-circle-timer";

import { heart } from "ionicons/icons";
import "./HeartRate.scss";

const HeartRate = ({ onChange }) => {
  const [rate, setRate] = useState(null);

  var seconds = 20; // Number of seconds to count for

  function updateBeats(e) {
    var beats = e.detail.value;
    // console.log(beats, onChange);
    if (onChange) {
      var rate = beats * (60 / seconds);
      onChange(rate);
    }
  }

  return (
    <>
      <div id="heartratePage">
        <IonTitle>
          <IonIcon icon="heart" />
        </IonTitle>
        <p>
          Find your pulse by firmly gripping your wrist like in the diagram
          below. Count your heartbeats for {seconds} seconds.
        </p>
        <img
          style={{
            display: "block",
            maxWidth: "230px",
            maxHeight: "95px",
            width: "auto",
            height: "auto",
          }}
          src="assets/heartrate.png"
        />

        <div className="timer">
          <CountdownCircleTimer
            onComplete={() => {
              return [true];
            }}
            isPlaying
            size={90}
            duration={seconds}
            initialRemainingTime={10}
            colors={[
              ["#004777", 0.33],
              ["#F7B801", 0.33],
              ["#A30000", 0.33],
            ]}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
        </div>

        <p>How many beats did you count?</p>
        <IonInput
          type="number"
          placeholder="Beats"
          onIonChange={updateBeats}
          countdownID="heartrate"
        />
      </div>
    </>
  );
};

export default HeartRate;
