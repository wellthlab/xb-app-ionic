import React from "react";
import { IonRange, IonItem, IonLabel } from "@ionic/react";

const SliderInput = function ({
  label,
  value,
  optional,
  onIonChange,
  range: [max, min],
  step,
}) {
  const handleChange = function (e) {
    if (onIonChange) {
      onIonChange(e.detail.value);
    }
  };

  return (
    <IonItem>
      <IonLabel className="ion-text-wrap" position="stacked">
        {label} {!optional ? "*" : null}
      </IonLabel>
      <IonRange
        max={max}
        min={min}
        value={value}
        onIonChange={handleChange}
        step={step}
      />
    </IonItem>
  );
};

export default SliderInput;
