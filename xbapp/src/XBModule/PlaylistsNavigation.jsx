import React from "react";
import {
  IonCard,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonLabel,
  IonText,
} from "@ionic/react";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";

const PlaylistsNavigation = function ({ playlists, currentPlaylist }) {
  const playlistCount = playlists.length;
  const shouldRenderNavigation = playlistCount > 1;

  const [playlistIdx, setPlaylistIdx] = React.useState(currentPlaylist);
  const createPlaylistIdxHandler = function (direction) {
    return () => {
      const newIdx = playlistIdx + direction;
      if (newIdx < 0 || newIdx >= playlistCount) {
        return;
      }

      setPlaylistIdx(newIdx);
    };
  };

  const playlist = playlists[playlistIdx];

  return (
    <IonCard>
      <IonItem lines="none" className="playlist-navigate-button-item">
        <IonGrid>
          {/* Navigation buttons */}

          <IonRow>
            <IonCol>
              {/* In an item to make use of the slot property */}
              <IonItem lines="none" className="button-padding">
                {/* Previous button */}

                {!shouldRenderNavigation ? null : (
                  <IonButton
                    slot="start"
                    size="regular"
                    onClick={createPlaylistIdxHandler(-1)}
                    disabled={!playlistIdx}
                  >
                    <IonIcon icon={chevronBackOutline} />
                  </IonButton>
                )}

                {/* Current playlist name */}

                <IonLabel className="ion-text-center ion-text-wrap">
                  <IonText className="ion-text-big ion-text-wrap">
                    <div>
                      <strong>{playlist.name}</strong>
                    </div>
                  </IonText>
                </IonLabel>

                {/* Next button */}

                {!shouldRenderNavigation ? null : (
                  <IonButton
                    slot="end"
                    size="regular"
                    onClick={createPlaylistIdxHandler(1)}
                    disabled={playlistIdx === playlistCount - 1}
                  >
                    <IonIcon icon={chevronForwardOutline} />
                  </IonButton>
                )}
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </IonCard>
  );
};

export default PlaylistsNavigation;
