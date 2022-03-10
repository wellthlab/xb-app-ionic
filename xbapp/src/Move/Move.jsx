import {
  IonContent,
  IonSpinner,
  IonLabel,
  IonItem,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
} from "@ionic/react";
import { mailOutline, journalOutline, bodyOutline } from "ionicons/icons";

import "./Move.css";
import XBHeader from "../util/XBHeader";

function MovementWelcome(props) {
  return (
    <IonPage>
      <XBHeader title={"Move"} />
      {/* <IonContent> */}
      <IonItem className="vcs" lines="none">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem button className="ion-text-center">
                <IonLabel>Journal</IonLabel>
                <IonIcon icon={journalOutline} />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem
                button
                className="ion-text-center"
                routerLink="/move/task-playlist"
                routerDirection="forward"
              >
                <IonLabel>Move</IonLabel>
                <IonIcon icon={bodyOutline} />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem button className="ion-text-center">
                <IonLabel>Invitations</IonLabel>
                <IonIcon icon={mailOutline} />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
      {/* </IonContent> */}
    </IonPage>
  );
}

export default MovementWelcome;
