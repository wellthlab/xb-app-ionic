import React from "react";
import { IonItem, IonLabel, IonInput } from "@ionic/react";

const TextInput = function ({
  label,
  value,
  onIonChange,
  optional,
  ...others
}) {
  const handleChange = function (e) {
    if (onIonChange) {
      onIonChange(e.detail.value);
    }
  };

  return (
    <IonItem>
      <IonLabel position="floating">
        {label} {!optional ? "*" : null}
      </IonLabel>
      <IonInput value={value} onIonChange={handleChange} {...others} />
    </IonItem>
  );
};

export default TextInput;
