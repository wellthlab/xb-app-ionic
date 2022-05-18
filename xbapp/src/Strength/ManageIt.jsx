import { useState } from "react";
import {
  IonItem,
  IonRow,
  IonCol,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonIcon,
} from "@ionic/react";
import { checkmarkOutline, closeOutline } from "ionicons/icons";

import Video from "./Video";

function ManageItQuestion({ attempt, onSubmit }) {
  let [yesDisabled, setYesDisabled] = useState(false);
  let [noDisabled, setNoDisabled] = useState(false);

  return (
    <>
      <IonRow>
        <IonCol class="ion-text-start">
          <IonItem lines="none">Attempt {attempt}</IonItem>
        </IonCol>
        <IonCol class="ion-text-end">
          <IonButton
            disabled={yesDisabled}
            onClick={() => {
              setNoDisabled(true);
              let response = {};
              response["attempt-" + attempt] = "yes";
              onSubmit(response);
            }}
          >
            <IonIcon icon={checkmarkOutline} />
          </IonButton>
          <IonButton
            disabled={noDisabled}
            onClick={() => {
              setYesDisabled(true);
              let response = {};
              response["attempt-" + attempt] = "no";
              onSubmit(response);
            }}
          >
            <IonIcon icon={closeOutline} />
          </IonButton>
        </IonCol>
      </IonRow>
    </>
  );
}

function ManageItTask({ task, onSubmit }) {
  return (
    <>
      <Video onSubmit={onSubmit} video={task.video} />
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Did you manage it?</IonCardTitle>
          <IonCardSubtitle>
            This will let you track your progress
          </IonCardSubtitle>
        </IonCardHeader>
        <ManageItQuestion attempt={1} onSubmit={onSubmit} />
        <ManageItQuestion attempt={2} onSubmit={onSubmit} />
        <ManageItQuestion attempt={3} onSubmit={onSubmit} />
      </IonCard>
    </>
  );
}

export default ManageItTask;
