import React from "react";
import { IonPage, IonContent } from "@ionic/react";

import ModuleDetail from "./ModuleDetail";
import PlaylistsNavigation from "./PlaylistsNavigation";
import XBHeader from "../../util/XBHeader";

const ModuleOverview = function ({ xbModule, currentPlaylist }) {
  return (
    <IonPage>
      <XBHeader title={xbModule.name} colour={xbModule.colour} />
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
