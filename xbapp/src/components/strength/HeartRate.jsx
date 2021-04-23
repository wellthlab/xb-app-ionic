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
        <p>
          Find your pulse by firmly gripping your wrist like in the diagram
          below. Start the timer and count your heartbeats for {seconds} seconds.
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
        <CountDown seconds={20} />
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
