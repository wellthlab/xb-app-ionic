import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonLabel,
  IonRow,
} from "@ionic/react";
import {
  chevronBackOutline,
  chevronForwardOutline,
  saveOutline,
} from "ionicons/icons";

/**
 * Provides previous and next buttons at the bottom of the playlist player
 * to navigate through the playlist tasks
 *
 * @param numTasks
 * @param currentTaskIdx
 * @param nextTaskInPlaylist
 * @param goToNextTask
 * @param goToPrevTask
 * @param teamId
 * @param moduleId
 * @param playlistIdx
 */
function PlaylistProgressionButtons({
  numTasks,
  currentTaskIdx,
  goToNextTask,
  goToPrevTask,
  teamId,
  moduleId,
  playlistIdx,
}) {
  const atEndOfPlaylist = currentTaskIdx >= numTasks - 1;

  return (
    <IonGrid className="PlaylistNavigation">
      <IonRow>
        {/* Back button */}
        <IonCol>
          <IonButton
            expand="block"
            onClick={goToPrevTask}
            disabled={currentTaskIdx <= 0}
            size="normal"
          >
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
        </IonCol>
        {/* Next button  or save */}
        <IonCol>
          <IonButton
            expand="block"
            onClick={goToNextTask}
            routerLink={atEndOfPlaylist ? "/move" : undefined}
            size="normal"
          >
            {atEndOfPlaylist ? <IonLabel slot="end">Finish</IonLabel> : ""}
            <IonIcon
              icon={atEndOfPlaylist ? saveOutline : chevronForwardOutline}
              slot="start"
            />
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}

export default PlaylistProgressionButtons;
