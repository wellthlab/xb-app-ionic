import { useState } from "react";
import {
  IonContent,
  IonSpinner,
  IonGrid,
  IonLabel,
  IonCol,
  IonRow,
  IonItem,
  IonPage,
  IonList,
  IonIcon,
  IonItemGroup,
  IonText,
} from "@ionic/react";
import {
  warningOutline,
  playOutline,
  checkboxOutline,
  arrowForwardOutline,
} from "ionicons/icons";
import { connect } from "react-redux";

import { addControllersProp } from "../util_model/controllers";

import XBHeader from "../util/XBHeader";
import GenericModal from "../Info/components/GenericModal";
import PlaylistDetail from "./components/PlaylistDetail";
import SubscribeToModule from "./components/PlaylistSubscriber";
import ColorBar from "./components/ColorBar";

/**
 * Renders a page where users can see their active playlists, and click to
 * display information about that playlist and play it. Also allows users to
 * see all possible modules, and subscribe to them.`
 *
 * @param props.controllers
 * @param props.modules
 * @param props.teams
 * @param props.userProfile
 *
 */
function PlaylistPicker(props) {
  const [showModal, setShowModal] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState(undefined);
  const [activePlaylistId, setActivePlaylistId] = useState(undefined);
  const [activePlaylistStage, setActivePlaylistStage] = useState(undefined);
  const [titleBarColour, setTitleBarColour] = useState("");
  const [totMins, setTotMins] = useState(0);
  function toggleModal() {
    setShowModal(!showModal);
  }

  props.controllers.LOAD_TEAMS_IF_REQD();
  props.controllers.SET_USER_PROFILE_IF_REQD();
  props.controllers.LOAD_MODULES_IF_REQD();

  if (
    !props.teams.loaded ||
    !props.userProfile.loaded ||
    !props.modules.loaded
  ) {
    return <IonSpinner className="center-spin" name="crescent" />;
  }

  let userProfile = props.userProfile.userProfile;
  const availableModules = props.modules.modules;
  const team = props.teams.teams.bybox.move[0];
  const expDay = team.experiment.day;

  // userProfile.modules is an object with keys which are the module topics,
  // i.e. strength-training. We need to loop through each topic and get the
  // id of the modules the user is subscribed to and push this to a list of
  // all module ids
  const userModules = userProfile.modules ? userProfile.modules : {};
  const activeModules = [];
  // TODO: this is not scalable, and should be refactored
  for (const [id, moduleObj] of Object.entries(userModules)) {
    // this is over modules in a topic
    if (moduleObj.active) {
      activeModules.push(moduleObj);
    }
  }

  // So then we have an array of module objects the user is subscribed to.
  // and now we create a list of clickable items
  let activePlaylists = activeModules.map((userModuleObj) => {
    const module = availableModules.find((m) => m._id === userModuleObj.id);
    const moduleColour = module.info.colour;
    const currentPlaylist = userModuleObj.stage;
    const playlistMinutes = module.playlists[currentPlaylist].minutes;

    // TODO: redundant code if an experiment starts on day 1 :)
    const expDayIdx = expDay === 0 ? 0 : expDay - 1;
    const moduleDoneToday =
      userModuleObj.id in team.entries[expDayIdx].completedModules;

    // When the user clicks on a playlist, this will fill in the details
    // required to show the details of it in the GenericModal
    function createPlaylistDetailModal() {
      toggleModal();
      setPlaylistTitle(module.name);
      setActivePlaylistId(module._id);
      setActivePlaylistStage(currentPlaylist);
      setTitleBarColour(module.info.colour);
    }

    return (
      <>
        <IonItem>
          <IonGrid>
            <IonRow>
              <IonCol
                size="1"
                style={{ "background-color": moduleColour }}
              ></IonCol>
              <IonCol>
                <IonItem
                  button
                  lines="none"
                  key={module.id}
                  detail={false}
                  detailIcon={arrowForwardOutline}
                  onClick={createPlaylistDetailModal}
                >
                  <IonLabel>
                    <IonRow>{module.name}</IonRow>
                    <IonRow>{playlistMinutes} minutes</IonRow>
                  </IonLabel>
                  <IonLabel slot="end">
                    {moduleDoneToday ? (
                      <IonIcon size="large" icon={checkboxOutline} />
                    ) : (
                      <IonIcon size="large" icon={playOutline} />
                    )}
                  </IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      </>
    );
  });

  function getMinuteBreakdown() {
    let colorBarData = [];
    let totalMinutes = 0;

    // Loop though all the responses today and look for minutes contributed
    // from each module the user has done "movement" for
    for (const response of team.entries[expDay - 1].responses) {
      if (response.minutes && response.minutes > 1e-10) {
        // the > 1e-10 is for tasks like quizzes which have minutes 1e-10
        totalMinutes += parseFloat(response.minutes);
        const module = availableModules.find(
          (m) => m._id === response.moduleId
        );
        colorBarData.push({
          moduleId: response.moduleId,
          value: response.minutes,
          color: module.info.colour,
        });
      }
    }

    // Combine multiple entries for the same module into one entry by adding
    // the minute values together
    const combinedData = new Map();
    colorBarData.forEach((item) => {
      const moduleId = item["moduleId"];
      if (combinedData.has(moduleId)) {
        let totalMinutes =
          parseFloat(item.value) + parseFloat(combinedData.get(moduleId).value);
        combinedData.set(moduleId, { ...item, value: totalMinutes });
      } else {
        combinedData.set(moduleId, item);
      }
    });
    colorBarData = Array.from(combinedData.values());

    // Now we deed to calculate the percentage of the total minutes for the
    // colorbar component
    for (let i in colorBarData) {
      colorBarData[i].percentage = `${Math.round(
        (colorBarData[i].value / totalMinutes) * 100
      )}%`;
    }

    return {
      totalMinutes: totalMinutes,
      colorBarData: colorBarData,
    };
  }

  const minuteBreakDown = getMinuteBreakdown();

  return (
    <>
      {/* Modal for detailed playlist page */}
      <GenericModal
        titleBarColour={titleBarColour}
        showModal={showModal}
        toggleModal={toggleModal}
        title={playlistTitle}
        body={
          <PlaylistDetail
            team={team}
            modules={availableModules}
            moduleId={activePlaylistId}
            currentPlaylistIdx={activePlaylistStage}
            closeModal={toggleModal}
          />
        }
      />

      {/* Playlist picker page */}
      <IonPage>
        <XBHeader title="Movement Playlists"></XBHeader>
        <IonContent>
          {/* List of plans the user is subscribed to */}
          <IonItem lines="none">
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonText>
                    <h4>Your Playlists</h4>
                  </IonText>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol>
                  {activePlaylists.length > 0 ? (
                    <>
                      <IonList>
                        <IonItemGroup>{activePlaylists}</IonItemGroup>
                      </IonList>
                    </>
                  ) : (
                    <IonItem lines="none">
                      <IonIcon icon={warningOutline} slot="start" />
                      <div>
                        You have no active playlists, pick some below to play
                      </div>
                    </IonItem>
                  )}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="ion-text-center">
                  <IonText>
                    {minuteBreakDown.totalMinutes > 0 ? (
                      <>
                        You've moved for{" "}
                        <strong>{minuteBreakDown.totalMinutes} minutes</strong>{" "}
                        today!
                      </>
                    ) : (
                      <>You haven't done any movement yet!</>
                    )}
                  </IonText>

                  <ColorBar visualParts={minuteBreakDown.colorBarData} />
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
          {/* Where other plans can be picked */}
          <IonItem lines="none">
            <IonText>
              <h3>Other Playlists</h3>
            </IonText>
          </IonItem>
          <IonItem lines="none">
            <SubscribeToModule
              userProfile={userProfile}
              modules={availableModules}
            />
          </IonItem>
        </IonContent>
      </IonPage>
    </>
  );
}

export default connect(
  (state, ownProps) => {
    return {
      modules: state.modules,
      userProfile: state.userProfile,
      teams: state.teams,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(PlaylistPicker));
