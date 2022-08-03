import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import NumberInput from "../components/NumberInput";
import "./HeartRate.scss";

const HeartRateTask = ({ value, onIonChange, ...others }) => {
  const handleChange = function (beats) {
    if (onIonChange) {
      onIonChange(parseFloat(beats) * 3);
    }
  };

  return (
    <>
      <p>
        Find your pulse by firmly gripping your wrist like in the diagram below.
        Count your heartbeats for 20 seconds.
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

      <NumberInput
        value={!value ? null : value / 3}
        onIonChange={handleChange}
        {...others}
      />
    </>
  );
};

export default HeartRateTask;
