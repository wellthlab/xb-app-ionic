import { useState, useEffect } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
  IonTextarea,
} from "@ionic/react";
import { arrowForwardOutline } from "ionicons/icons";
import XBHeader from "../util/XBHeader";

/**
 * Journal entries for people to reflect on their movement
 *
 */
function JournalEntry(props) {
  let [textEntry, setTextEntry] = useState(null);

  let id = props.match.params.id;
  let task = props.match.params.task;

  return (
    <>
      <XBHeader title={"Journal"} />
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Have you tried {task}?</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonRow>
              <IonCol>
                {/* <IonItem> */}
                <IonLabel>Let us know your thoughts below</IonLabel>
                {/* </IonItem> */}
                {/* <IonItem> */}
                <IonTextarea
                  value={textEntry}
                  autoGrow={true}
                  inputMode={"text"}
                  rows={3}
                  autofocus={true}
                  onIonChange={(e) => {
                    setTextEntry(e.detail.value);
                  }}
                  style={{ "--background": "#eb4034" }}
                ></IonTextarea>
                {/* </IonItem> */}
              </IonCol>
            </IonRow>
          </IonCardContent>
          <IonButton expand="full">
            Save Entry &nbsp; <IonIcon icon={arrowForwardOutline} />
          </IonButton>
        </IonCard>
      </IonContent>
    </>
  );
}

export default JournalEntry;
