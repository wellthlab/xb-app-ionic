import React from "react";
import { IonRange, IonItem, IonLabel } from "@ionic/react";

const SliderInput = function ({
  label,
  value,
  optional,
  onIonChange,
  range: [min, max],
  step,
}) {
  const handleChange = function (e) {
    if (onIonChange) {
      onIonChange(e.detail.value);
    }
  };

  return (
    <div>
      <IonItem lines="none" style={{ overflow: "visible" }}>
        <IonLabel className="ion-text-wrap" position="stacked">
          {label} {!optional ? "*" : null}
        </IonLabel>
      </IonItem>
      <IonRange
        max={max}
        min={min}
        value={value}
        onIonChange={handleChange}
        step={step}
        ticks
        snaps
      >
        <IonLabel slot="start">{min}</IonLabel>
        <IonLabel slot="end">{max}</IonLabel>
      </IonRange>
    </div>
  );
};

export default SliderInput;
