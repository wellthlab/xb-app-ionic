import React, { useState, useEffect } from "react";
import { IonButton, IonIcon, IonInput, IonTitle } from "@ionic/react";
import { connect } from "react-redux";
import CountDown from "../user_input/CountDown";

import { heart } from "ionicons/icons";

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
      <IonTitle>
        <IonIcon icon="heart" />
      </IonTitle>
      <p>Find your pulse, and count your heartbeats for {seconds} seconds.</p>
      <CountDown seconds={20} />
      <p>How many beats did you count?</p>
      <IonInput
        type="number"
        placeholder="Beats"
        onIonChange={updateBeats}
        countdownID="heartrate"
      />
    </>
  );
};

export default HeartRate;
