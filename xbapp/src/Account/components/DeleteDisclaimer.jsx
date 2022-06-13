import React from "react";
import { IonButton, IonRow } from "@ionic/react";

const DeleteDisclaimer = ({ onReject, onProceed }) => {
  return (
    <div className="ion-text-justify">
      <br />
      Are you sure? Proceeding will send us a request to delete all your
      personal information, including this account. This process is irreversible
      <IonRow className="ion-justify-content-end">
        <IonButton fill="clear" onClick={onReject}>
          No, I changed my mind
        </IonButton>
        <IonButton color="danger" onClick={onProceed}>
          Proceed
        </IonButton>
      </IonRow>
    </div>
  );
};

export default DeleteDisclaimer;
