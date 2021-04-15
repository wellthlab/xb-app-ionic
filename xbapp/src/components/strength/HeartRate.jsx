import React, { useState, useEffect } from "react";
import { IonButton, IonIcon, IonInput, IonTitle } from "@ionic/react";
import { connect } from "react-redux";
import CountDown from "../user_input/CountDown";

import { heart } from "ionicons/icons";
import "./HeartRate.scss";

const HeartRate = ({ onChange }) => {
  const [rate, setRate] = useState(null);

  var seconds = 20; // Number of seconds to count for

  function updateBeats(e) {
    var beats = e.detail.value;
    console.log(beats, onChange);
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
        <h3>Record Your Pulse</h3>
        <p>
          Find your pulse by firmly gripping your wrist like in the diagram
          below.
        </p>
        <p>
          Start the time below and count your heartbeats for {seconds} seconds.
        </p>
        <img src="assets/heartrate.png" />
        <CountDown seconds={20} />
        <h4>How Many Beats?</h4>
        <p>Enter what you counted below:</p>
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
