import { IonItem, IonLabel, IonText } from "@ionic/react";

/**
 * Display a summary message for the movement minutes.
 *
 * @param tasksForDate - the object containing the data for the day
 */
function MinuteSummary({ tasksForDate }) {
  return (
    <IonItem lines="none" className="ion-text-center">
      <IonLabel>
        <IonText>
          <h1>On this day</h1>
          {tasksForDate && tasksForDate.minutes > 0 ? (
            <>
              You moved for a total of <strong>{tasksForDate.minutes}</strong>{" "}
              minutes!
            </>
          ) : (
            <>You didn't record any movement!</>
          )}
        </IonText>
      </IonLabel>
    </IonItem>
  );
}

export default MinuteSummary;
