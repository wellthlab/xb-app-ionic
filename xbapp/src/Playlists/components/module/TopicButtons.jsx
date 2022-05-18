import { IonGrid, IonRow, IonCol } from "@ionic/react";

import Button from "./Button";

/**
 * Main page/logic for subscribing to modules
 *
 * @params team - the team object for the user
 * @params modules - the modules available to be subscribed to
 * @params userProfile - the user's profile
 * @params controllers - controller functions
 */
function TopicButtons(props) {
  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <Button topic="strength" title="Strength Training" />
        </IonCol>
      </IonRow>
      {/* <IonRow>
        <IonCol>
          <TopicButton topic="endurance" title="Endurance Training" />
        </IonCol>
      </IonRow> */}
      {/* <IonRow>
        <IonCol>
          <TopicButton topic="neuro" title="Neuromobility" />
        </IonCol>
      </IonRow> */}
    </IonGrid>
  );
}

export default TopicButtons;
