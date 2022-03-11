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
  let [showModal, setShowModal] = useState(false);
  let [playlistTitle, setPlaylistTitle] = useState(undefined);
  let [activePlaylistId, setActivePlaylistId] = useState(undefined);
  let [activePlaylistStage, setActivePlaylistStage] = useState(undefined);
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
    return <IonSpinner class="center-spin" name="crescent" />;
  }

  let userProfile = props.userProfile.userProfile;
  const modules = props.modules.modules;
  const team = props.teams.teams.bybox.move[0];

  // userProfile.modules is an object with keys which are the module topics,
  // i.e. strength-training. We need to loop through each topic and get the
  // id of the modules the user is subscribed to and push this to a list of
  // all module ids
  const userSubscribedModules = userProfile.modules ? userProfile.modules : {};
  const subscribedModuleIds = [];
  for (const [topic, moduleIds] of Object.entries(userSubscribedModules)) {
    subscribedModuleIds.push(...moduleIds);
  }

  console.log("subscribedModuleIds", subscribedModuleIds);
  console.log("userSubscribedModules", userSubscribedModules);

  // Now we have a list of all module ids the user is subscribed to, we
  // construct a list of clickable items to load that module
  let activePlaylists = subscribedModuleIds.map((id) => {
    const module = modules.find((m) => m._id === id);
    // const stage = userProfile.progress[id];
    const stage = 1;
    function createModal() {
      toggleModal();
      setPlaylistTitle(module.name);
      setActivePlaylistId(module._id);
      setActivePlaylistStage(stage);
    }
    return (
      <>
        <IonItem
          button
          key={module.id}
          detail={true}
          detailIcon={playOutline}
          onClick={createModal}
        >
          <IonLabel>{module.name}</IonLabel>
          <IonLabel>Stage {stage}</IonLabel>
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
                  {activePlaylists.length ? (
                    <>
                      <IonList>
                        <IonItemGroup>{activePlaylists}</IonItemGroup>
                      </IonList>

                      <GenericModal
                        showModal={showModal}
                        toggleModal={toggleModal}
                        title={playlistTitle}
                        message={
                          <PlaylistDetail
                            team={team}
                            modules={modules}
                            moduleId={activePlaylistId}
                            currentStage={activePlaylistStage}
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
            <SubscribeToModule userProfile={userProfile} modules={modules} />
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
