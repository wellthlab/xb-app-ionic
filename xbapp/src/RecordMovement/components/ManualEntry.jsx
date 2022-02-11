import React, { useState, useEffect } from "react";
import { IonButton, IonIcon, IonCol, IonInput, IonItem } from "@ionic/react";
import { saveOutline } from "ionicons/icons";

/**
 *  Manual time input for movement
 *
 * props.onSave
 */
function ManualTime(props) {
  // save input and reset the input box
  function saveMinutes() {}

  return (
    <>
      <IonCol>
        <h3>Enter your MINUTES manually</h3>
        <IonItem>
          <IonInput placeholder={"minutes"}></IonInput>
          <IonButton>
            <IonIcon icon={saveOutline}></IonIcon> &nbsp;Save
          </IonButton>
        </IonItem>
      </IonCol>
    </>
  );
}

export default ManualTime;
