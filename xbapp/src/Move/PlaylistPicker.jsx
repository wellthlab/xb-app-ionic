import { useEffect, useState } from "react";
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
  IonButton,
  IonIcon,
  IonItemGroup,
  IonText,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import { warningOutline, playOutline, toggle } from "ionicons/icons";

import { connect } from "react-redux";
import { addControllersProp } from "../util_model/controllers";

import XBHeader from "../util/XBHeader";
import GenericModal from "../Info/components/GenericModal";
import PlaylistDetail from "./components/PlaylistDetail";
import SubscribeToModule from "./components/PlaylistSubscriber";

/**
 * Main page for users to track and record their movements
 *
 */
function PlaylistPicker(props) {
  const [showModal, setShowModal] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState(undefined);
  const [activePlaylistId, setActivePlaylistId] = useState(undefined);
  const [activePlaylistStage, setActivePlaylistStage] = useState(undefined);
  const [titleBarColour, setTitleBarColour] = useState("");
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

  // userProfile.modules is an object with keys which are the module topics,
  // i.e. strength-training. We need to loop through each topic and get the
  // id of the modules the user is subscribed to and push this to a list of
  // all module ids
  const userModules = userProfile.modules ? userProfile.modules : {};
  const activeModules = [];

  // this is over each topic
  // TODO: this is not scalable, and should be refactored
  for (const [id, moduleObj] of Object.entries(userModules)) {
    // this is over modules in a topic
    if (moduleObj.active) {
      activeModules.push(moduleObj);
    }
  }

  // so then we have an array of module objects the user is subscribed to.
  // and now we create a list of clickable items
  let activePlaylists = activeModules.map((userModuleObj) => {
    const module = availableModules.find((m) => m._id === userModuleObj.id);
    const colour = module.info.colour;
    const stage = userModuleObj.stage;

    // debugger;

    const minutes = module.playlists[stage].minutes;
    function createModal() {
      toggleModal();
      setPlaylistTitle(module.name);
      setActivePlaylistId(module._id);
      setActivePlaylistStage(stage);
      setTitleBarColour(module.info.colour);
    }
    return (
      <>
        <IonItem>
          <IonGrid>
            <IonRow>
              <IonCol size="1" style={{ "background-color": colour }}></IonCol>
              <IonCol>
                <IonItem
                  button
                  lines="none"
                  key={module.id}
                  detail={false}
                  detailIcon={playOutline}
                  onClick={createModal}
                >
                  <IonLabel>
                    <IonRow>{module.name}</IonRow>
                    <IonRow>{minutes} minutes</IonRow>
                  </IonLabel>
                  <IonLabel slot="end">
                    <IonButton>
                      <IonIcon icon={playOutline}></IonIcon>
                    </IonButton>
                  </IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      </>
    );
  });

  return (
    <>
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
                            currentStage={activePlaylistStage}
                            closeModal={toggleModal}
                          />
                        }
                      />
                    </>
                  ) : (
                    <IonItem lines="none">
                      <IonIcon icon={warningOutline} slot="start" />
                      <div>You have no active playlists</div>
                    </IonItem>
                  )}
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
