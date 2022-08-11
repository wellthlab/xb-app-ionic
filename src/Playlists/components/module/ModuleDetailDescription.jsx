import {
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonProgressBar,
  IonRow,
  IonText,
} from "@ionic/react";
import parse from "html-react-parser";

import XBInfo from "../../../util/XBInfo";

/**
 *
 * @param isPlaying
 * @param module
 * @param userProgressIdx
 * @param currentPlaylistIdx
 * @param updateUserModuleObject
 * @returns {JSX.Element}
 * @constructor
 */
function ModuleDetailDescription({
  isPlaying,
  module,
  userProgressIdx,
  currentPlaylistIdx,
  updateUserModuleObject,
}) {
  const modulePlaylists = module.playlists;
  const numPlaylists = modulePlaylists.length;

  return (
    <div>
      <XBInfo
        title={<strong>{module.name.toUpperCase()}</strong>}
        desc={
          <div>
            {module.info.desc
              ? parse(module.info.desc)
              : "No description available."}
          </div>
        }
      />
      {/* Only show progression if there is > 1 playlist and not in explore mode
       */}
      {isPlaying && numPlaylists > 1 ? (
        <IonItem lines="none" className="playlist-progress">
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonLabel className="ion-text-center">
                  <IonText className="ion-text-big">
                    {userProgressIdx + 1 < modulePlaylists.length + 1 ? (
                      <>
                        You are on playlist {userProgressIdx + 1} of{" "}
                        {modulePlaylists.length}
                      </>
                    ) : (
                      <>
                        You have <strong>completed</strong> this playlist!
                        <br />
                        Feel free to go back and replay!
                      </>
                    )}
                  </IonText>
                </IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonProgressBar
                value={(userProgressIdx + 1) / modulePlaylists.length}
              />
            </IonRow>
          </IonGrid>
        </IonItem>
      ) : (
        ""
      )}
    </div>
  );
}

export default ModuleDetailDescription;
