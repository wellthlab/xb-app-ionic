import React, { useState, useEffect } from "react";

import { IonButton, IonIcon, IonCol, IonInput, IonItem } from "@ionic/react";

import {  } from "ionicons/icons";


/**
 *  Manual time input for movement
 */
function ManualTime(props) {
  return (
    <>
      <IonCol>
        <h3>Enter your <strong>minutes</strong> manually</h3>
        <IonItem>
          <IonInput
            placeholder={"minutes"}
            onIonChange={(e) => props.onChange(parseFloat(e.detail.value))}
            inputMode={"numeric"}
            min={"0"}
            max={"7"}
          ></IonInput>
        </IonItem>
      </IonCol>
    </>
  );
}

export default ManualTime;
