import React from "react";
import {
  IonCard,
  IonGrid,
  IonButton,
  IonIcon,
  IonCardTitle,
  IonCardHeader,
  IonRow,
} from "@ionic/react";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";

import PlaylistTasks from "./PlaylistTasks";

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
      <IonCardHeader>
        {/* 
            Navigation buttons
            In an item to make use of the slot property
        */}
        <IonGrid>
          <IonRow className="ion-justify-content-between ion-align-items-center">
            {/* Previous button */}

            {!shouldRenderNavigation ? null : (
              <IonButton
                size="regular"
                onClick={createPlaylistIdxHandler(-1)}
                disabled={!playlistIdx}
              >
                <IonIcon icon={chevronBackOutline} />
              </IonButton>
            )}

            {/* Current playlist name */}

            <IonCardTitle className="ion-text-center">
              {playlist.name}
            </IonCardTitle>

            {/* Next button */}

            {!shouldRenderNavigation ? null : (
              <IonButton
                size="regular"
                onClick={createPlaylistIdxHandler(1)}
                disabled={playlistIdx === playlistCount - 1}
              >
                <IonIcon icon={chevronForwardOutline} />
              </IonButton>
            )}
          </IonRow>
        </IonGrid>

        {/* Tasks */}

        <PlaylistTasks tasks={playlist.tasks} />
      </IonCardHeader>
    </IonCard>
  );
};

export default PlaylistsNavigation;
