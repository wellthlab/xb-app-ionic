import { useState } from "react";
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonRange,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { sadOutline, happyOutline } from "ionicons/icons";

function Slider({ tag, statement, min, max, onSubmit }) {
  const [value, setValue] = useState(5);

  function handleChange(e) {
    let response = {};
    response[tag] = e.detail.value;
    onSubmit(response);
    setValue(e.detail.value);
  }

  return (
    <>
      <IonItem>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText style={{ fontSize: "1.2em" }}>{statement}</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonRange
                min={min}
                max={max}
                step={1}
                snaps={true}
                ticks={true}
                pin={true}
                color="secondary"
                value={value}
                onIonChange={(e) => {
                  handleChange(e);
                }}
              >
                <IonIcon icon={sadOutline} slot="start" />
                <IonIcon icon={happyOutline} slot="end" />
              </IonRange>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </>
  );
}

export default Slider;
