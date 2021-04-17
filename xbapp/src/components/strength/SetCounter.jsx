import React, { useState, useEffect } from "react";
import { IonButton, IonItem, IonInput, IonIcon } from "@ionic/react";

import { addCircleOutline, removeCircleOutline } from "ionicons/icons";

/**
 * Count Reps
 */
const RepCounter = ({ onChange, start }) => {
  const [sets, setSets] = useState(start ? start : 0);

  function save() {
    if (onChange) {
      onChange(sets);
    }
  }

  // TODO
  return (
    <div style={{ paddingTop: "10px" }}>
      <IonButton
        onClick={() => {
          setSets(sets - 1);
          save();
        }}
      >
        <IonIcon icon={removeCircleOutline} />
      </IonButton>
      <span
        style={{
          fontSize: "2em",
          fontWeight: "bold",
          display: "inline-block",
          padding: "0 5px 0 5px",
        }}
      >
        {sets}
      </span>
      <IonButton
        onClick={() => {
          setSets(sets + 5);
          save();
        }}
      >
        <IonIcon icon={addCircleOutline} /> <strong>5</strong>
      </IonButton>
      <IonButton
        onClick={() => {
          setSets(sets + 1);
          save();
        }}
      >
        <IonIcon icon={addCircleOutline} /> <strong>1</strong>
      </IonButton>
    </div>
  );
};

export default RepCounter;
