import React from "react";

import { IonProgressBar } from "@ionic/react";

import XBInfo from "../../util/XBInfo";

const ModuleDetail = function ({ xbModule, currentPlaylistIdx }) {
  const playlistCount = xbModule.playlists.length;
  const completed = currentPlaylistIdx + 1 === playlistCount;

  const progressBar =
    playlistCount <= 1 ? null : (
      <React.Fragment>
        <div className="ion-margin-top ion-margin-bottom ion-text-center">
          {!completed ? (
            `You are on playlist ${currentPlaylistIdx + 1} of ${playlistCount}`
          ) : (
            <React.Fragment>
              You have <strong>completed</strong> this playlist! Feel free to go
              back and replay!
            </React.Fragment>
          )}
        </div>
        <IonProgressBar value={(currentPlaylistIdx + 1) / playlistCount} />
      </React.Fragment>
    );

  return (
    <XBInfo
      title={xbModule.name.toUpperCase()}
      desc={xbModule.desc || "No description avaiable"}
    >
      {progressBar}
    </XBInfo>
  );
};

export default ModuleDetail;
