import {
  IonButton,
  IonCard,
  IonCol,
  IonGrid,
  IonItem,
  IonRow,
  IonText,
} from "@ionic/react";
import React from "react";

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function CreateJoinTeamCard({ expid, setDoneEverything }) {
  return (
    <IonCard>
      <IonItem lines="none" color="transparent" className="ion-text-justify">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText className="ion-text-center ion-text-justify">
                To get started you can either start a new team, or join somebody
                else's. If you start a new team, you can keep it just for you,
                or invite other people to join you.
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <div className="centering">
                <br />
                <IonButton
                  routerLink={"/start/join/" + expid}
                  onClick={() => {
                    if (setDoneEverything) setDoneEverything();
                  }}
                  size="regular"
                >
                  Join a Team
                </IonButton>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <div className="centering">
                <IonButton
                  routerLink={"/start/create/" + expid}
                  onClick={() => {
                    if (setDoneEverything) setDoneEverything();
                  }}
                  size="regular"
                >
                  Start a Team
                </IonButton>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </IonCard>
  );
}

export default CreateJoinTeamCard;
