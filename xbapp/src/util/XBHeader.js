import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import React from "react";

const XBHeader = (props) => {


  return (
    <IonHeader>
      <IonToolbar style={{...props.style, "--background": props.colour}}>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/" />
        </IonButtons>
        <IonTitle>{props.title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default XBHeader;
