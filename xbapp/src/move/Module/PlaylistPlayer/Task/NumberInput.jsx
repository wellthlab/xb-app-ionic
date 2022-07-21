import React from "react";

import TextInput from "./components/TextInput";

const NumberInput = function ({ value, onIonChange, ...others }) {
  const handleChange = function (e) {
    const newValue = e.detail.value;

    if (/^[0-9]*$/.test(newValue) && onIonChange) {
      onIonChange(parseInt(newValue, 10));
    }
  };

  return <TextInput value={value} onIonChange={handleChange} {...others} />;
};

export default NumberInput;
