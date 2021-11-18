import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonItem,
  IonRow,
  IonGrid,
  IonCol,
  IonIcon,
} from "@ionic/react";

import { addCircleOutline, alert, removeCircleOutline } from "ionicons/icons";
import "./SetCounter.css";

/**
 * Count Reps
 */
const SetCounter = (props) => {
  const [sets, setSets] = useState(props.sets);
  const [reps, setReps] = useState(0);

  function save(message) {
    var repsToReturn = sets * 5 + reps;
    if (message == "+1set") {
      //adding 5 reps
      repsToReturn += 5;
      setSets(sets + 1);
    } else if (message == "-1set") {
      //removing 5 reps
      repsToReturn -= 5;
      setSets(sets - 1);
    } else if (message == "+1rep") {
      repsToReturn += 1;
      setReps(reps + 1);
    } else if (message == "-1rep") {
      repsToReturn -= 1;
      setReps(reps - 1);
    }
    if (props.onChange) {
      props.onChange(repsToReturn);
    }
  }

  // TODO
  return (
    <div style={{ paddingTop: "10px" }}>
      <IonItem>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton
                onClick={() => {
                  save("-1set");
                }}
                className="normalButton"
              >
                <IonIcon icon={removeCircleOutline} /> &nbsp;{" "}
                <strong>1 SET</strong>
              </IonButton>
            </IonCol>
            <IonCol>
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
            </IonCol>
            <IonCol>
              <IonButton
                className="bigButton"
                onClick={() => {
                  save("+1set");
                }}
              >
                <IonIcon icon={addCircleOutline} /> &nbsp;{" "}
                <strong>1 SET</strong>
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                onClick={() => {
                  save("-1rep");
                }}
                className="normalButton"
              >
                <IonIcon icon={removeCircleOutline} /> &nbsp;{" "}
                <strong>1 REP</strong>
              </IonButton>
            </IonCol>
            <IonCol>
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
                {reps}
              </span>
            </IonCol>
            <IonCol>
              <IonButton
                onClick={() => {
                  save("+1rep");
                }}
                className="normalButton"
              >
                <IonIcon icon={addCircleOutline} /> &nbsp;{" "}
                <strong>1 REP</strong>
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </div>
  );
};

export default SetCounter;
