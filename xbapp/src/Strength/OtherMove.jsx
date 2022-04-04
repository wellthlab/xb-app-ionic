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
  IonTextarea,
} from "@ionic/react";

/**
 * Show a video
 * Immediately fires onSubmit to provide a video response; so only suitable for use in the timer
 * video should be a youtube ID
 */
const OtherMove = ({ task, onSubmit }) => {
  return (
    <IonCard>
      <IonCardContent>
        <IonItem>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonText>
                  <div class="ion-text-justify">
                    {task.instructions ? (
                      <>{task.instructions}</>
                    ) : (
                      <>
                        Any activity that raises your heart rate above normal
                        counts as movement! How are you moving?
                      </>
                    )}
                  </div>
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonTextarea
                  placeholder="Enter your movement here"
                  autoGrow={true}
                  rows={1}
                  onIonChange={(e) => {
                    onSubmit({ movement: e.detail.value });
                  }}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
};

export default OtherMove;
