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
import "./Eat.scss";
import { connect } from "react-redux";

const EatPage = (props) => {
  return (
    <IonPage>
      <XBHeader title="Eat"></XBHeader>
      <IonContent id="about">
        <h4>Eat</h4>
        <p>Be patient, the eat box will open in week 4.</p>
      </IonContent>
    </IonPage>
  );
};

export default EatPage;
