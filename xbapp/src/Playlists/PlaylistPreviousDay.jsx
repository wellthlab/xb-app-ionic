import { useState } from "react";
import {
  IonButton,
  IonCol,
  IonRow,
  IonGrid,
  IonCard,
  IonCardContent,
  IonInput,
  IonCardHeader,
  IonCardTitle,
  IonLabel,
  IonItem,
  IonPage,
  IonContent,
  IonSpinner,
  IonDatetime,
  IonCardSubtitle,
} from "@ionic/react";
import { connect } from "react-redux";

import { addControllersProp } from "../util_model/controllers";
import XBHeader from "../util/XBHeader";
import PlaylistInfo from "./components/player/PlaylistInfo";

/**
 *
 * @param teams
 * @param modules
 * @param controllers
 * @param match
 * @returns {JSX.Element}
 * @constructor
 */
function PlaylistPreviousDay({ teams, modules, controllers, match }) {
  const [date, setDate] = useState(undefined);
  const [minutes, setMinutes] = useState(0);

  controllers.LOAD_TEAMS_IF_REQD();
  controllers.LOAD_MODULES_IF_REQD();

  if (!teams.loaded || !modules.loaded) {
    return <IonSpinner name="crescent" class="center-spin" />;
  }

  const teamId = match.params.teamId;
  const moduleId = match.params.moduleId;
  const currentPlaylist = parseInt(match.params.playlistIdx, 10);
  const userProgress = parseInt(match.params.progress, 10);
  const module = modules.modules.find((m) => m._id === moduleId);
  const experimentStart = new Date(
    teams.teams.bybox["move"][0].experiment.start
  );
  const ready = date && minutes;

  async function saveResponse() {
    const dateObj = new Date(date);
    const dateDiff = dateObj - experimentStart;

    let response = {};
    // response.submitted = dateObj.toISOString();
    response.intype = "previous-day";
    response.type = "previous-day";
    response.minutes = minutes;
    response.moduleId = moduleId;
    response.playlist = currentPlaylist;
    response.playlistName = module.playlists[currentPlaylist].desc;
    response.moduleName = module.name;
    response.day = Math.ceil(dateDiff / 1000 / 3600 / 24);

    await controllers.ADD_RESPONSE(teamId, response);
    if (minutes > 0 && currentPlaylist === userProgress) {
      await controllers.PROGRESS_ALONG_MODULE(moduleId);
    }
  }

  return (
    <>
      <IonPage>
        <XBHeader title={"Previous entry"} colour={module.info.colour} />
        <IonContent>
          <PlaylistInfo
            module={module}
            currentPlaylist={currentPlaylist}
            isSnack={false}
          />

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                Did you do this playlist on another day?
              </IonCardTitle>
              <IonCardSubtitle>
                There's no need to lose your minutes. Enter the date, time and
                length of your movement here.
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonItem button detail={false} lines="none">
                      <IonLabel>When?</IonLabel>
                      <IonDatetime
                        firstDayOWeek={1}
                        placeholder="Select a date"
                        pickerFormat="DD MMMM YYYY HH mm"
                        displayFormat="DDDD DD MMMM YYYY, hh:mm a"
                        onIonChange={(e) => setDate(e.detail.value)}
                        min={experimentStart.toISOString()}
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem button detail={false} lines="none">
                      <IonLabel>How long?</IonLabel>
                      <IonInput
                        placeholder="Enter minutes"
                        className="ion-text-end"
                        style={{
                          "--placeholder-opacity": "0.4",
                        }}
                        onIonChange={(e) => setMinutes(e.detail.value)}
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonButton
                      expand="block"
                      disabled={!ready}
                      onClick={saveResponse}
                      routerLink="/move"
                    >
                      Save
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    </>
  );
}

export default connect((state, ownProps) => {
  return {
    teams: state.teams,
    modules: state.modules,
  };
})(addControllersProp(PlaylistPreviousDay));
