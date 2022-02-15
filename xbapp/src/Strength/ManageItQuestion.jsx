import { IonItem, IonRow, IonCol, IonButton } from "@ionic/react";
import { useState } from "react";

function ManageItQuestion({ attempt, onSubmit }) {
  let [yesDisabled, setYesDisabled] = useState(false);
  let [noDisabled, setNoDisabled] = useState(false);

  return (
    <>
      <IonRow>
        <IonCol class="ion-text-start">
          <IonItem>Attempt {attempt}</IonItem>
        </IonCol>
        <IonCol class="ion-text-end">
          <IonButton
            disabled={yesDisabled}
            onClick={() => {
              setNoDisabled(true);
              onSubmit({
                assType: "manageit",
                attempts: attempt,
                response: "yes",
              });
            }}
          >
            Yes
          </IonButton>
          <IonButton
            disabled={noDisabled}
            onClick={() => {
              setYesDisabled(true);
              onSubmit({
                assType: "manageit",
                attempts: attempt,
                response: "no",
              });
            }}
          >
            No
          </IonButton>
        </IonCol>
      </IonRow>
    </>
  );
}

export default ManageItQuestion;
