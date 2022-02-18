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

  React.useMemo(() => {
    setSets(props.sets);
  }, [props.sets]);

  function save(message) {
    var repsToReturn = sets * 5 + reps;
    if (message === "+1set") {
      //adding 5 reps
      repsToReturn += 5;
      setSets(sets + 1);
    } else if (message === "-1set" && sets > 0) {
      //removing 5 reps
      repsToReturn -= 5;
      setSets(sets - 1);
    } else if (message === "+1rep") {
      repsToReturn += 1;
      setReps(reps + 1);
    } else if (message === "-1rep" && reps > 0) {
      repsToReturn -= 1;
      setReps(reps - 1);
    }
    if (reps < 0) {
      setReps(0);
    }
    console.log("repsToReturn", repsToReturn);
    if (props.onSubmit) {
      props.onSubmit({ assType: "Super Set", reps: repsToReturn });
    }
  }

  if (props.showReps) {
    // TODO

    if (reps > 5) {
      setReps(0);
      setSets(sets + 1);
    }

    return (
      <IonItem>
        <IonGrid>
          {/* SETS COUNTER */}

          <IonRow>
            <IonCol class="vertical-align-content">
              <IonButton
                onClick={() => {
                  save("-1set");
                }}
                className="bigButton"
              >
                <IonIcon icon={removeCircleOutline} /> &nbsp;
                <strong>1 SET</strong>
              </IonButton>
            </IonCol>

            <IonCol class="vertical-align-content">
              <span
                style={{
                  fontSize: "2em",
                  fontWeight: "bold",
                  display: "inline-block",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {sets}
              </span>
            </IonCol>

            <IonCol class="vertical-align-content">
              <IonButton
                className="bigButton"
                onClick={() => {
                  save("+1set");
                }}
              >
                <IonIcon icon={addCircleOutline} /> &nbsp;
                <strong>1 SET</strong>
              </IonButton>
            </IonCol>
          </IonRow>

          {/* REPS COUNTER */}

          <IonRow>
            <IonCol class="vertical-align-content">
              <IonButton
                onClick={() => {
                  save("-1rep");
                }}
                className="bigButton"
              >
                <IonIcon icon={removeCircleOutline} /> &nbsp;{" "}
                <strong>1 REP</strong>
              </IonButton>
            </IonCol>
            <IonCol class="vertical-align-content">
              <span
                style={{
                  fontSize: "2em",
                  fontWeight: "bold",
                  display: "inline-block",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {reps}
              </span>
            </IonCol>
            <IonCol class="vertical-align-content">
              <IonButton
                onClick={() => {
                  save("+1rep");
                }}
                className="bigButton"
              >
                <IonIcon icon={addCircleOutline} /> &nbsp;{" "}
                <strong>1 REP</strong>
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    );
  } else {
    return <></>;
  }
};

export default SetCounter;
