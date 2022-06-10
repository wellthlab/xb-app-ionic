import { useState } from "react";
import {
  IonCol,
  IonGrid,
  IonItem,
  IonRow,
  IonText,
  IonTextarea,
} from "@ionic/react";

function FreeText({ tag, statement, onSubmit }) {
  const [text, setText] = useState("");

  function handleChange(e) {
    let response = {};
    response[tag] = e.detail.value;
    response["minutes"] = 1e-10;
    onSubmit(response);
    setText(e.detail.value);
  }

  return (
    <IonItem lines="none">
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonText className="ion-text-big">{statement}</IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonTextarea
              value={text}
              placeholder={"Enter your response here..."}
              autoGrow={true}
              autoCapitalize={true}
              rows={1}
              onIonChange={(e) => handleChange(e)}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
}

export default FreeText;
