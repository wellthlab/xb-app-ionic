import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { addOutline } from "ionicons/icons";

/**
 * A floating action button to add a new note.
 *
 * @param segmentChoice - the current segment chosen for the tab bar
 * @param dateSelected - the current date selected on the calendar
 * @param team - the current team
 * @param experimentDay - the current experiment day
 *
 */
function AddNoteButton({ segmentChoice, dateSelected, team, experimentDay }) {
  return (
    <>
      {segmentChoice === "notes" ? (
        <IonFab vertical="bottom" horizontal="end">
          <IonFabButton
            routerLink={
              "/journal/note/" +
              team._id +
              "/" +
              experimentDay +
              "/" +
              dateSelected.toISOString() +
              "/" +
              segmentChoice
            }
          >
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      ) : (
        ""
      )}
    </>
  );
}

export default AddNoteButton;
