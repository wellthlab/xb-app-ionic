import React from "react";

import TextInput from "./TextInput";

const NumberInput = function ({ value, onIonChange, ...others }) {
  const handleChange = function (newValue) {
    if (onIonChange) {
      if (/^\d*(\.\d*)?$/.test(newValue)) {
        onIonChange(newValue);
        return;
      }

      onIonChange(value);
    }
  };

  return <TextInput value={value} onIonChange={handleChange} {...others} />;
};

export default NumberInput;
