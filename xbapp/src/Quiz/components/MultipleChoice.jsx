import { useState } from "react";
import {
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonRadio,
  IonLabel,
  IonRadioGroup,
} from "@ionic/react";

function MultipleChoice({ tag, statement, choices, onSubmit }) {
  const [value, setValue] = useState(null);

  function handleChange(e) {
    let response = {};
    response[tag] = e.detail.value;
    response["minutes"] = 1e-10;
    onSubmit(response);
    setValue(e.detail.value);
  }

  const radioChoices = choices.map((choice, index) => {
    return (
      <IonItem lines="none">
        <IonLabel>{choice}</IonLabel>
        <IonRadio slot="start" value={choice} />
      </IonItem>
    );
  });

  return (
    <IonItem>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonText style={{ fontSize: "1.2em" }}>{statement}</IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonRadioGroup
              allowEmptySelection={true}
              value={value}
              onIonChange={(e) => {
                handleChange(e);
              }}
            >
              {radioChoices}
            </IonRadioGroup>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
}

export default MultipleChoice;
