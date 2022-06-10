import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonText,
  IonTextarea,
  IonItem,
} from "@ionic/react";

function Journal({ prompt, onSubmit }) {
  return (
    <IonCard>
      <IonItem>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText className="ion-text-big">{prompt}</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonTextarea
                placeholder={"Enter your response here..."}
                onIonChange={(e) => {
                  onSubmit({ note: e.detail.value, minutes: 1e-10 });
                }}
                rows={4}
                autoCapitalize={true}
                autoGrow={true}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </IonCard>
  );
}

export default Journal;
