import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonItem,
  IonInput,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import XBHeader from "../../components/XBHeader";
import "./Move.scss";
import { connect } from "react-redux";

const EatPage = (props) => {
  return (
    <IonPage>
      <XBHeader title="Move"></XBHeader>
      <IonContent>
        <h4>Move</h4>
        <p>TODO</p>
      </IonContent>
    </IonPage>
  );
};

export default EatPage;
