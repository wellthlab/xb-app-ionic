import {
  IonContent,
  IonLabel,
  IonItem,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  useIonAlert,
  IonThumbnail,
} from "@ionic/react";
import {
  mailOutline,
  journalOutline,
  bodyOutline,
  libraryOutline,
} from "ionicons/icons";

import "./Move.css";
import XBHeader from "../util/XBHeader";

function MovementWelcome(props) {
  const [notImplementedAlert] = useIonAlert();
  const notImplementedClick = () => {
    notImplementedAlert("This isn't ready just yet!", [{ text: "Ok" }]);
  };

  return (
    <IonPage>
      <XBHeader title={"Move"} />
      <IonContent>
        <IonItem className="vcs" lines="none">
          <IonGrid>
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
                <IonItem
                  button
                  className="ion-text-center"
                  onClick={notImplementedClick}
                >
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
                  onClick={notImplementedClick}
                >
                  <IonLabel>Invitations</IonLabel>
                  <IonIcon icon={mailOutline} />
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem
                  button
                  className="ion-text-center"
                  onClick={notImplementedClick}
                >
                  <IonLabel>Library</IonLabel>
                  <IonIcon icon={libraryOutline} />
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      </IonContent>
    </IonPage>
  );
}

export default MovementWelcome;
