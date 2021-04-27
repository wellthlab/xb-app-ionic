import React, { useState, useEffect } from "react";
import { IonButton, IonItem, IonInput, IonIcon } from "@ionic/react";

import { addCircleOutline, alert, removeCircleOutline } from "ionicons/icons";

/**
 * Count Reps
 */
const RepCounter = (props) => {
  const [sets, setSets] = useState(props.start ? props.start : 0);

  function save(message) {
    var value = sets;
    if (message == "+5") {
      value += 5;
    } else if (message == "+1") {
      value += 1;
      setSets(sets + 1);
    } else if (message == "-1") {
      value -= 1;
      setSets(sets - 1);
    }
    if (props.onChange) {
      props.onChange(value);
    }

    setSets(value);
  }

  // TODO
  return (
    <div style={{ paddingTop: "10px" }}>
      <IonButton
        onClick={() => {
          save("-1");
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
          width: "90px",
          textAlign: "center",
        }}
      >
        {sets}
      </span>
      <IonButton
        onClick={() => {
          save("+5");
        }}
      >
        <IonIcon icon={addCircleOutline} /> &nbsp; <strong>5</strong>
      </IonButton>
      <IonButton
        onClick={() => {
          save("+1");
        }}
      >
        <IonIcon icon={addCircleOutline} /> &nbsp; <strong>1</strong>
      </IonButton>
    </div>
  );
};

export default RepCounter;
