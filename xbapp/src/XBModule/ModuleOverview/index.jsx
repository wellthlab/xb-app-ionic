import React from "react";
import { IonPage, IonContent } from "@ionic/react";

import ModuleDetail from "./ModuleDetail";
import PlaylistsNavigation from "./PlaylistsNavigation";

const ModuleOverview = function ({ xbModule, currentPlaylist }) {
  return (
    <IonPage>
      <IonContent>
        <ModuleDetail
          xbModule={xbModule}
          currentPlaylistIdx={currentPlaylist}
        />
        <PlaylistsNavigation
          playlists={xbModule.playlists}
          currentPlaylistIdx={currentPlaylist}
        />
      </IonContent>
    </IonPage>
  );
};

export default ModuleOverview;
