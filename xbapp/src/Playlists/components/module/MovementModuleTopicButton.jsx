import { IonGrid, IonRow, IonCol } from "@ionic/react";

import TopicButton from "./TopicButton";

/**
 * Main page/logic for subscribing to modules
 *
 * @params team - the team object for the user
 * @params modules - the modules available to be subscribed to
 * @params userProfile - the user's profile
 * @params controllers - controller functions
 */
function MovementModuleTopicButton() {
  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <TopicButton topic="strength" title="Strength Training" />
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

export default MovementModuleTopicButton;
