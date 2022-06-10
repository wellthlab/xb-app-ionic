import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
} from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";

import Timer from "../../../Instruments/StatelessTimer";
import ManualTimer from "../../../Instruments/ManualTimeEntry";

/**
 * Timer UI for timing tasks, or manual entry of minutes
 *
 * @param task
 * @param team
 * @param manualEntry
 * @param setManualEntry
 * @param setMinutes
 * @param minutes
 */

function TaskTimer({
  task,
  team,
  useManualEntry,
  setManualEntry,
  setMinutes,
  minutes,
}) {
  let content;

  if (useManualEntry) {
    content = <ManualTimer minutes={minutes} setMinutes={setMinutes} />;
  } else {
    content = (
      <IonCol>
        {/* entry from timer */}
        <Timer
          id={team._id}
          active="false"
          onPause={(minutes) => setMinutes(minutes)}
        />
        <p style={{ textAlign: "center", paddingTop: "5px" }}>
          Stop the timer when you're done
        </p>
      </IonCol>
    );
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Time your session</IonCardTitle>
        <IonCardSubtitle>
          Start the timer when you start moving. Your minutes will be saved when
          you switch tasks.
        </IonCardSubtitle>
      </IonCardHeader>
      <IonGrid style={{ paddingTop: "0px" }}>
        {/* timer */}
        <IonRow>
          <IonCol>{content}</IonCol>
        </IonRow>
        {/* button */}
        <IonRow>
          <IonCol
            style={{
              textAlign: "center",
            }}
          >
            <IonButton
              onClick={() => {
                setManualEntry(!useManualEntry);
                setMinutes(0);
              }}
            >
              <IonIcon slot="start" icon={addCircleOutline} />
              {useManualEntry ? "Back to timer" : "Enter minutes manually"}
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCard>
  );
}

export default TaskTimer;
