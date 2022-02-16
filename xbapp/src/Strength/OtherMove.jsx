import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonItem,
  IonRow,
  IonGrid,
  IonCol,
  IonIcon,
  IonText,
  IonLabel,
  IonInput,
} from "@ionic/react";

import { addCircleOutline, alert, removeCircleOutline } from "ionicons/icons";
import "./SetCounter.css";

/**
 * Show a video
 * Immediately fires onSubmit to provide a video response; so only suitable for use in the timer
 * video should be a youtube ID
 */
const OtherMove = ({ onSubmit }) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <IonItem>
            <IonText>
              Any activity that raises your heart rate above normal counts as
              movement! Use this page to record your movement minutes that
              aren't captured elsewhere.
            </IonText>
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonItem>
            <IonLabel position="floating">
              What activity are you recording?
            </IonLabel>
            <IonInput
              onIonChange={(e) => {
                onSubmit({ movement: e.detail.value });
              }}
            ></IonInput>
          </IonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default OtherMove;
