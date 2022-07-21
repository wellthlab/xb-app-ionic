import React from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";

const NavigationButton = function ({ dir, ...props }) {
  return (
    <IonButton {...props}>
      <IonIcon icon={dir === -1 ? chevronBackOutline : chevronForwardOutline} />
    </IonButton>
  );
};

export default NavigationButton;
