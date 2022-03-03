import React, { useState, useEffect } from "react";
import {
  IonItem,
  IonRow,
  IonGrid,
  IonCol,
  IonCard,
  IonText,
  IonLabel,
  IonInput,
  IonCardContent,
} from "@ionic/react";

/**
 * Show a video
 * Immediately fires onSubmit to provide a video response; so only suitable for use in the timer
 * video should be a youtube ID
 */
const OtherMove = ({ onSubmit }) => {
  return (
    <IonCard>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonText>
                  <div class="ion-text-justify">
                    Any activity that raises your heart rate above normal counts
                    as movement! Use this page to record your movement minutes
                    that aren't captured elsewhere.
                  </div>
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
      </IonCardContent>
    </IonCard>
  );
};

export default OtherMove;
