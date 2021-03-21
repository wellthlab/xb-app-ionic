import React, { Component, useState } from "react";
import {
  IonButton,
  IonContent,
  IonAlert,
  IonPage,
  IonModal,
} from "@ionic/react";

function FunctionalityAlert(props) {
  if (!props.showAlert) {
    return null;
  }
  return (
    <div>
      <IonAlert
        isOpen={props.showAlert}
        onDidDismiss={props.toggleAlert}
        cssClass="my-custom-class"
        header={"Info"}
        message={props.message}
        buttons={["OK"]}
      />
    </div>
  );
}

export default FunctionalityAlert;
