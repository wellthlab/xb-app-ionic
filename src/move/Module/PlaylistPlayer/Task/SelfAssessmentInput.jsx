import React from "react";
import { IonCheckbox, IonItem, IonLabel } from "@ionic/react";

const SelfAssessmentInput = function ({ value, label, onIonChange }) {
  const handleChange = function (e) {
    if (onIonChange) {
      onIonChange(e.detail.checked);
    }
  };

  return (
    <IonItem lines="none">
      <IonCheckbox slot="start" checked={value} onIonChange={handleChange} />
      <IonLabel className="ion-text-wrap">
        {label || "OK, got it"}
      </IonLabel>
    </IonItem>
  );
};

export default SelfAssessmentInput;
