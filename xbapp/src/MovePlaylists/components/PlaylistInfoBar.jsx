import {
  IonRow,
  IonCol,
  IonItem,
  IonIcon,
  IonLabel,
  IonGrid,
  IonText,
  IonItemGroup,
} from "@ionic/react";

import "../PlaylistPlayer.css";

/**
 * Displays some useful information about the current playlist
 */
function PlaylistInfoBar({ module, currentPlaylist }) {
  return (
    <IonItem lines="full">
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonLabel>
                    <IonText className="ion-text-wrap ion-text-header">
                      {module.name}
                    </IonText>
                    <IonText className="ion-text-wrap">
                      <br /> Playlist {currentPlaylist + 1}/
                      {module.playlists.length}
                    </IonText>
                  </IonLabel>
                  <IonLabel slot="end">
                    <IonRow class="ion-text-center ion-text-header">
                      <IonText>
                        {module.playlists[currentPlaylist].desc}
                      </IonText>
                    </IonRow>
                    <IonRow>
                      <IonText>
                        {module.playlists[currentPlaylist].minutes} mins
                      </IonText>
                    </IonRow>
                  </IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
}

export default PlaylistInfoBar;
