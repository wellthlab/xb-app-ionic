import React from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";

import TimerInput from "./TimerInput";
import NumberInput from "./NumberInput";

const Timer = function ({ onChange, value, start, onStart, onEnd }) {
  const [manualEntry, setManualEntry] = React.useState(false);

  const handleChangeEntryMode = function () {
    setManualEntry(!manualEntry);
    onEnd();
  };

  const handleTimerInputChange = function (newValue) {
    onChange(newValue / 1000 / 60);
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
        {manualEntry ? (
          <NumberInput
            onChange={onChange}
            value={value}
            placeholder="Enter your minutes"
          />
        ) : (
          <TimerInput
            onChange={handleTimerInputChange}
            value={value !== null ? value * 1000 * 60 : value}
            start={start}
            onStart={onStart}
            onEnd={onEnd}
          />
        )}
        <IonButton expand="block" onClick={handleChangeEntryMode}>
          <IonIcon slot="start" icon={addCircleOutline} />
          {manualEntry ? "Back to timer" : "Enter minutes manually"}
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default Timer;
