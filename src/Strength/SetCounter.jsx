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

  function set(sets, reps) {
    setSets(sets);
    setReps(reps);

    if (props.onChange) {
      props.onChange(sets, reps);
    }
  }

  return (
    <IonItem>
      <IonGrid>

        <IonRow>

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
              {sets} SETS
            </span>
          </IonCol>

        </IonRow>

        {props.showReps ? (
          <IonRow>
            <IonCol class="vertical-align-content">
              <IonButton
                onClick={() => {
                  set(sets, Math.max(reps - 1, 0));
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
                  set(sets, reps + 1);
                }}
                className="bigButton"
              >
                <IonIcon icon={addCircleOutline} /> &nbsp;{" "}
                <strong>1 REP</strong>
              </IonButton>
            </IonCol>
          </IonRow>
        ) : (
          ""
        )}
      </IonGrid>
    </IonItem>
  );
};

export default SetCounter;
