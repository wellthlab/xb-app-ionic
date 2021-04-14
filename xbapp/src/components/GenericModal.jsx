import React, { Component, useState } from "react";
import {
  IonButton,
  IonContent,
  IonAlert,
  IonPage,
  IonModal,
} from "@ionic/react";

function GenericModal(props) {
  if (!props.showModal) {
    return null;
  }
  return (
    <div>
      <IonModal isOpen={props.showModal}>
        <IonContent>
          <h1 style={{ textAlign: "center" }}>
            <b>{props.title}</b>
          </h1>
          {props.message}
          <br />
          <br />
          <br />
        </IonContent>
        <IonButton onClick={props.toggleModal}>Close</IonButton>
      </IonModal>
    </div>
  );
}

export default GenericModal;
