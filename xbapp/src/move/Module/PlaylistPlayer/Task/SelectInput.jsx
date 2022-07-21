import React from "react";
import { IonItem, IonSelect, IonSelectOption, IonLabel } from "@ionic/react";

const SelectInput = function ({
  label,
  optional,
  options,
  value,
  onIonChange,
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
      <IonSelect interface="popover" value={value} onIonChange={handleChange}>
        {options.map((option) => (
          <IonSelectOption key={option} value={option}>
            {option}
          </IonSelectOption>
        ))}
      </IonSelect>
    </IonItem>
  );
};

export default SelectInput;
