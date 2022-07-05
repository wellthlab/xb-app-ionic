import React from "react";
import { IonInput } from "@ionic/react";

const NumberInput = function ({ value, onChange, placeholder }) {
  const handleChange = function (e) {
    const newValue = e.detail.value;

    if (/^[0-9]*$/.test(newValue) && onChange) {
      onChange(parseInt(newValue, 10));
    }
  };

  return (
    <IonInput
      placeholder={placeholder}
      type="number"
      value={value}
      onIonChange={handleChange}
    />
  );
};

export default NumberInput;
