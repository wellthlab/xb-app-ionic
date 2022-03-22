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
import { CheckmarkSharp, CloseSharp } from "react-ionicons";

function MultipleChoice({ tag, statement, choices, onSubmit }) {
  const [value, setValue] = useState(null);

  const radioChoices = choices.map((choice, index) => {
    return (
      <IonItem lines="none">
        <IonLabel>{choice}</IonLabel>
        <IonRadio slot="start" value={choice} />
      </IonItem>
    );
  });

  function handleChange(e) {
    let response = {};
    response[tag] = e.detail.value;
    onSubmit(response);
    setValue(e.detail.value);
  }

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
