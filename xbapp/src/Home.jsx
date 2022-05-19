import { IonContent, IonPage, IonSpinner } from "@ionic/react";
import { connect } from "react-redux";

import { addControllersProp } from "./util_model/controllers";

import XBHeader from "./util/XBHeader";
import UserProfile from "./UserProfile/SetUserProfile";
import Enroller from "./Boxes/components/Enroller";
import ModuleHome from "./Playlists/ModuleHome";

/**
 * Home page
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Home(props) {
  props.controllers.LOAD_TEAMS_IF_REQD();
  props.controllers.SET_USER_PROFILE_IF_REQD();
  props.controllers.LOAD_MODULES_IF_REQD();
  props.controllers.GET_FEED_IF_REQD();
  props.controllers.GET_LIBRARY_IF_REQD();

  if (
    !props.teams.loaded ||
    !props.userProfile.loaded ||
    !props.modules.loaded ||
    !props.feed.loaded ||
    !props.library.loaded
  ) {
    return (
      <IonPage>
        <XBHeader title="Move" />
        <IonContent>
          <div className="ion-text-center">
            <br />
            <img src="assets/strength_logo.png" alt="XB Logo" />
          </div>
          <IonSpinner className="center-spin" name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <XBHeader title="Move" />
      <IonContent>
        {props.teams.teams.bybox["move"] ? (
          <ModuleHome
            userProfile={props.userProfile}
            teams={props.teams}
            modules={props.modules}
          />
        ) : (
          <Enroller boxtype="move" />
        )}
      </IonContent>
    </IonPage>
  );
}

export default connect(
  (state, ownProps) => {
    return {
      modules: state.modules,
      userProfile: state.userProfile,
      teams: state.teams,
      feed: state.feed,
      library: state.library,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(Home));
