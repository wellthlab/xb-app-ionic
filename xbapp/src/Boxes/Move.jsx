import { IonContent, IonPage, IonSpinner } from "@ionic/react";
import { connect } from "react-redux";
import { addControllersProp } from "../util_model/controllers";

import "./Move.scss";
import XBHeader from "../util/XBHeader";
import Enroller from "./components/Enroller";
import GroupInfo from "./components/GroupInfo";

import UserProfile from "../UserProfile/UserProfile";

const MovePage = (props) => {
  props.controllers.LOAD_TEAMS_IF_REQD();
  props.controllers.LOAD_MODULES_IF_REQD();
  props.controllers.SET_USER_PROFILE_IF_REQD();
  if (
    !props.teams.loaded ||
    !props.modules.loaded ||
    !props.userProfile.loaded
  ) {
    return (
      <IonPage>
        <XBHeader title="Move" />
        <IonContent>
          <IonSpinner class="center-spin" name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  // Ask the user to enrol in a move experiment, set up their profile or show
  // current experiment info
  let content = null;
  if (!props.teams.teams.bybox["move"]) {
    content = <Enroller boxtype="move" />;
  } else if (!props.userProfile.userProfile) {
    content = <UserProfile pageType="move" />;
  } else {
    content = (
      <>
        <GroupInfo
          group={props.teams.teams.bybox["move"][0]}
          modules={props.modules.modules}
          match={props.match}
          controllers={props.controllers}
        />
      </>
    );
  }

  return (
    <IonPage>
      <XBHeader title="Progress"></XBHeader>
      <IonContent>{content}</IonContent>
    </IonPage>
  );
};

export default connect(
  (state, ownProps) => {
    return {
      teams: state.teams,
      experiments: state.experiments,
      userProfile: state.userProfile,
      modules: state.modules,
    };
  },
  {
    // Actions to include as props
  }
)(addControllersProp(MovePage));
