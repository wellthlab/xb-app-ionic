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
  IonTextarea,
} from "@ionic/react";
import { connect } from "react-redux";

import "./Note.css";

const Note = ({ onSubmit }) => {
  const [note, setNote] = useState("");

  return (
    <div style={{ padding: "15px" }}>
      <IonLabel>
        What do you wish to add as a note? For instance, here are a few ideas:
        <br></br>- How do you feel?
        <br></br>- How was your workout?
        <br></br>- What questions have come up?
        <br></br>- What parts are you enjoying of the experience?
        <br></br>- What could change?
        <br></br>- What new things did you learn today?
      </IonLabel>
      <IonTextarea
        placeholder="Enter your note"
        onIonChange={(e) => {
          setNote(e.detail.value);
        }}
      ></IonTextarea>
      {note.length > 0 ? (
        <IonButton
          onClick={() => {
            onSubmit({
              note: note,
            });
          }}
        >
          Save
        </IonButton>
      ) : (
        ""
      )}
    </div>
  );
};

export default Note;
