import React from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { playOutline, pauseOutline, refreshOutline } from "ionicons/icons";
import dateFormat from "dateformat";

import "./Timer.css";

const Timer = function () {
  const [intervalId, setIntervalId] = React.useState(null);
  const [elapsed, setElapsed] = React.useState(0);

  const handleTimerButtonClick = function () {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      return;
    }

    setIntervalId(
      setInterval(() => {
        // use callback to prevent interval reading old state due to closure
        setElapsed((prevElapsed) => prevElapsed + 1000);
      }, 1000)
    );
  };

  const handleReset = function () {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    setElapsed(0);
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Time your session</IonCardTitle>
        <IonCardSubtitle>
          Start your timer when you start moving. Your minutes will be saved
          when you switch tasks
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow className="ion-justify-content-center timer-display">
            {dateFormat(elapsed, "UTC:HH:MM:ss")}
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonButton onClick={handleTimerButtonClick}>
              <IonIcon icon={intervalId ? pauseOutline : playOutline} />
            </IonButton>
            <IonButton>
              <IonIcon icon={refreshOutline} onClick={handleReset} />
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default Timer;
