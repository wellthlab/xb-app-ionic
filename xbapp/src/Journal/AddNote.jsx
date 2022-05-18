import { useState } from "react";
import {
  IonInput,
  IonTextarea,
  IonItem,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonContent,
  IonPage,
} from "@ionic/react";
import { useHistory } from "react-router";

import { addControllersProp } from "../util_model/controllers";
import XBHeader from "../util/XBHeader";

function AddNote(props) {
  const history = useHistory();
  const [note, setNote] = useState("");

  const day = parseInt(props.match.params.day, 10);
  const teamId = props.match.params.teamId;
  const isoDate = props.match.params.isoDate;
  const feed = props.match.params.feed;

  function handleChange(e) {
    setNote(e.detail.value);
  }

  async function saveNote() {
    const noteToSave = {
      note: note,
      day: day,
      intype: "note",
      type: "journal-entry",
    };
    await props.controllers.ADD_RESPONSE(teamId, noteToSave);
    history.push("/journal/" + isoDate + "/" + feed);
  }

  return (
    <IonPage>
      <XBHeader title="Add Note" />
      <IonContent>
        <IonItem lines="full">
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonText className="ion-text-big">
                  Add to your journal here
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonTextarea
                  value={note}
                  onIonChange={(e) => handleChange(e)}
                  placeholder={"Enter text here..."}
                  autofocus={true}
                  autoCapitalize={true}
                  autoGrow={true}
                  rows={4}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton expand="block" onClick={saveNote} disabled={!note}>
                  Save
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      </IonContent>
    </IonPage>
  );
}

export default addControllersProp(AddNote);
