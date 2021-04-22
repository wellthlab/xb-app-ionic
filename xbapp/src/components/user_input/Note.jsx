import React, { useState, useEffect } from "react";
import {
  IonItem,
  IonListHeader,
  IonContent,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonPage,
  IonHeader,
  IonRange,
  IonItemDivider,
  IonButton,
  IonTextarea
} from "@ionic/react";
import { connect } from "react-redux";

import './Note.css';

const Note = ({onSubmit}) => {
  const [note, setNote] = useState("");


  return (
    <div style={{padding: "15px"}}>
      <IonTextarea placeholder="Enter your note" onIonChange={ (e) => {
        setNote(e.detail.value);
      }}>
      </IonTextarea>
      { note.length > 0 ?
      <IonButton onClick={() => {
        onSubmit({
          note: note
        });
      }}>Save</IonButton> : "" }
    </div>
  );
};

export default Note;
