import { IonInput, IonItem, IonLabel } from "@ionic/react";

/**
 *  Manual time input for movement
 *
 * @param onChange
 */
function ManualTimer({ minutes, setMinutes }) {
  return (
    <IonItem>
      <IonLabel position={"stacked"}>Enter your minutes here</IonLabel>
      <IonInput
        autofocus={true}
        value={minutes > 0 ? minutes : undefined}
        placeholder={"Minutes"}
        onIonChange={(e) => {
          const minutes = parseInt(e.detail.value, 10);
          if (minutes > 0) setMinutes(minutes);
        }}
        inputMode={"numeric"}
      />
    </IonItem>
  );
}

export default ManualTimer;
