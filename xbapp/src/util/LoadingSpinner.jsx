import { IonPage, IonContent, IonSpinner } from "@ionic/react";

import XBHeader from "./XBHeader";

/*
 * Simple check for whether something is loading or not.
 *
 * If it is loading, code for a spinner is returned, otherwise false is
 * returned.
 */
function loadingSpinner({ title, thingToCheck }) {
  console.log("thingToCheck", thingToCheck);
  if (!thingToCheck) {
    return (
      <IonPage>
        <XBHeader title={title} />
        <IonContent>
          <IonSpinner name="crescent" className="center-spin" />
        </IonContent>
      </IonPage>
    );
  } else {
    return false;
  }
}

export default loadingSpinner;
