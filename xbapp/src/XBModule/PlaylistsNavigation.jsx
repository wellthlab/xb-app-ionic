import React from "react";
import {
  IonCard,
  IonGrid,
  IonCol,
  IonButton,
  IonIcon,
  IonCardTitle,
  IonCardHeader,
  IonRow,
  IonText,
} from "@ionic/react";
import {
  chevronBackOutline,
  chevronForwardOutline,
  playOutline,
  calendarOutline,
} from "ionicons/icons";

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

        <div className="ion-text-center ion-margin-top ion-margin-bottom">
          <IonText color="dark">
            <p>
              This playlist will take a maximum of {playlist.minutes} minutes to
              finish
            </p>
          </IonText>
          <p>Press play to start, or click a task to start from</p>
        </div>

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton
                expand="block"
                color="success"
                disabled={currentPlaylist !== playlistIdx}
              >
                <IonIcon icon={playOutline} slot="start" />
                Play
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton expand="block">
                <IonIcon icon={calendarOutline} slot="start" />
                Past
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
    </IonCard>
  );
};

export default PlaylistsNavigation;
