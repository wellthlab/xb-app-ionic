import React from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
} from "@ionic/react";

const XBInfo = function ({ title, desc, children }) {
  return (
    <IonCard>
      {!title ? null : (
        <IonCardHeader>
          <IonCardTitle className="ion-text-center">{title}</IonCardTitle>
        </IonCardHeader>
      )}

      {!desc ? null : (
        <IonCardContent>
          <IonText color="dark">
            <span dangerouslySetInnerHTML={{ __html: desc }} />
          </IonText>

          {children}
        </IonCardContent>
      )}
    </IonCard>
  );
};

export default XBInfo;
