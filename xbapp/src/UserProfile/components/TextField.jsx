import { useState } from "react";
import { IonInput, IonItem, IonLabel } from "@ionic/react";

/**
 * Component for free text input
 *
 * @param {string} input - the input value
 * @param {string} label - label for input
 * @param {string} profileObjKey - unique identifier for input
 * @param {function} updateProfileObj - function to update profile object
 */
function TextField({ input, inputLabel, profileObjKey, updateProfileObj }) {
  const [value, setValue] = useState(input);

  function handleChange(e) {
    updateProfileObj(profileObjKey, e.detail.value);
    setValue(e.detail.value);
  }

  return (
    <IonItem>
      <IonLabel position="floating">{inputLabel}</IonLabel>
      <IonInput value={value} onIonChange={(e) => handleChange(e)} />
    </IonItem>
  );
}

export default TextField;
