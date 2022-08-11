import { useState } from "react";
import { IonItem, IonLabel, IonSelect, IonSelectOption } from "@ionic/react";

/**
 * Component for multiple choice input
 *
 * @param {string} input - the input value
 * @param {string} label - label for input
 * @param {array} choices - the choices to be presented
 * @param {string} profileObjKey - unique identifier for input
 * @param {function} updateProfileObj - function to update profile object
 */
function ChoiceField({
  input,
  inputLabel,
  choices,
  profileObjKey,
  updateProfileObj,
}) {
  const [value, setValue] = useState(input);

  function handleChange(e) {
    setValue(e.detail.value);
    updateProfileObj(profileObjKey, e.detail.value);
  }

  const selections = choices.map((choice) => {
    return <IonSelectOption value={choice}>{choice}</IonSelectOption>;
  });

  return (
    <IonItem>
      <IonLabel position="floating">{inputLabel}</IonLabel>
      <IonSelect
        interface="action-sheet"
        multiple={false}
        value={value}
        onIonChange={(e) => {
          handleChange(e);
        }}
      >
        {selections}
      </IonSelect>
    </IonItem>
  );
}

export default ChoiceField;
