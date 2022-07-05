import React from "react";
import { IonGrid, IonRow, IonButton, IonIcon } from "@ionic/react";
import { playOutline, pauseOutline, refreshOutline } from "ionicons/icons";
import dateFormat from "dateformat";

import "./TimerInput.css";

const TimerInput = function ({ onChange, value, start, onStart, onEnd }) {
  const intervalCallbackRef = React.useRef();

  React.useEffect(() => {
    intervalCallbackRef.current = () => {
      onChange(value + 1000);
    };
  }, [value, onChange]);

  React.useEffect(() => {
    let intervalId;

    if (!start) {
      clearInterval(intervalId);
    } else {
      intervalId = setInterval(() => {
        intervalCallbackRef.current();
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [start]);

  const handleTimerButtonClick = function () {
    if (start) {
      onEnd();
    } else {
      onStart();
    }
  };

  const handleReset = function () {
    onChange(0);
    onEnd();
  };

  return (
    <IonGrid>
      <IonRow className="ion-justify-content-center timer-display">
        {dateFormat(value, "UTC:HH:MM:ss")}
      </IonRow>
      <IonRow className="ion-justify-content-center">
        <IonButton onClick={handleTimerButtonClick}>
          <IonIcon icon={start ? pauseOutline : playOutline} />
        </IonButton>
        <IonButton onClick={handleReset}>
          <IonIcon icon={refreshOutline} />
        </IonButton>
      </IonRow>
    </IonGrid>
  );
};

export default TimerInput;
