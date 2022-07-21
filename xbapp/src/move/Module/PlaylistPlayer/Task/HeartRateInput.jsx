import React from "react";
import { IonInput, IonTitle, IonIcon } from "@ionic/react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { heartOutline } from "ionicons/icons";

import "./HeartRate.scss";

const HeartRateTask = ({ value, onChange }) => {
  const updateBeats = function (e) {
    var beats = e.detail.value;
    if (onChange) {
      onChange(beats * 3);
    }
  };

  return (
    <>
      <div id="heartratePage">
        <IonTitle>
          <IonIcon icon={heartOutline} />
        </IonTitle>
        <p>
          Find your pulse by firmly gripping your wrist like in the diagram
          below. Count your heartbeats for 20 seconds.
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
            duration={20}
            initialRemainingTime={10}
            colors={[
              ["#004777", 0.33],
              ["#F7B801", 0.33],
              ["#faa1a1", 0.33],
            ]}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
        </div>

        <p>How many beats did you count?</p>
        <IonInput
          type="number"
          placeholder="Beats"
          value={value / 3}
          onIonChange={updateBeats}
          countdownID="heartrate"
        />
      </div>
    </>
  );
};

export default HeartRateTask;
