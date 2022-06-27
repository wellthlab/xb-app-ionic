import React from "react";

import {
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonProgressBar,
  IonRow,
  IonText,
} from "@ionic/react";

import XBInfo from "../util/XBInfo";

const ModuleDetail = function ({ xbModule, currentPlaylist }) {
  const playlistCount = xbModule.playlists.length;

  const completed = currentPlaylist + 1 === playlistCount;

  return (
    <div>
      <XBInfo
        title={<strong>{xbModule.name.toUpperCase()}</strong>}
        desc={
          xbModule.desc ? (
            <div
              dangerouslySetInnerHTML={{
                __html: xbModule.desc, // Should be sanitised already by server
              }}
            />
          ) : (
            "No description available."
          )
        }
      />

      {playlistCount <= 1 ? null : (
        <IonItem lines="none" className="playlist-progress">
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonLabel className="ion-text-center">
                  <IonText className="ion-text-big">
                    {!completed ? (
                      `You are on playlist ${
                        currentPlaylist + 1
                      } of ${playlistCount}`
                    ) : (
                      <React.Fragment>
                        You have <strong>completed</strong> this playlist! Feel
                        free to go back and replay!
                      </React.Fragment>
                    )}
                  </IonText>
                </IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonProgressBar value={(currentPlaylist + 1) / playlistCount} />
            </IonRow>
          </IonGrid>
        </IonItem>
      )}
    </div>
  );
};

export default ModuleDetail;
