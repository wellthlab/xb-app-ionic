import React from "react";

import { IonProgressBar } from "@ionic/react";

import XBInfo from "../util/XBInfo";

const ModuleDetail = function ({ xbModule, currentPlaylist }) {
  const playlistCount = xbModule.playlists.length;
  const completed = currentPlaylist + 1 === playlistCount;

  const progressBar =
    playlistCount <= 1 ? null : (
      <React.Fragment>
        <div className="ion-margin-top ion-margin-bottom ion-text-center">
          {!completed ? (
            `You are on playlist ${currentPlaylist + 1} of ${playlistCount}`
          ) : (
            <React.Fragment>
              You have <strong>completed</strong> this playlist! Feel free to go
              back and replay!
            </React.Fragment>
          )}
        </div>
        <IonProgressBar value={(currentPlaylist + 1) / playlistCount} />
      </React.Fragment>
    );

  return (
    <XBInfo
      title={xbModule.name.toUpperCase()}
      desc={xbModule.desc || "No description avaiable"}
      extra={progressBar}
    />
  );
};

export default ModuleDetail;
