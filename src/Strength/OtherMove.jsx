import {
  IonItem,
  IonRow,
  IonGrid,
  IonCol,
  IonCard,
  IonText,
  IonCardContent,
  IonTextarea,
} from "@ionic/react";

/**
 * Show a video
 * Immediately fires onSubmit to provide a video response; so only suitable for use in the timer
 * video should be a youtube ID
 */
const OtherMove = ({ task, onSubmit }) => {
  return (
    <IonCard>
      <IonCardContent>
        <IonItem style={{ "--padding-start": "0px" }}>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonText>
                  <div className="ion-text-justify">
                    Any activity that raises your heart rate above normal counts
                    as movement! How are you moving?
                  </div>
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonTextarea
                  placeholder="Enter your movement here"
                  autoGrow={true}
                  rows={1}
                  onIonChange={(e) => {
                    onSubmit({ movement: e.detail.value });
                  }}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
};

export default OtherMove;
