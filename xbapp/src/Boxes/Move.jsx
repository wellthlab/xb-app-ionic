import { IonContent, IonPage, IonSpinner } from "@ionic/react";
import { connect } from "react-redux";
import { addControllersProp } from "../util_model/controllers";

import "./Move.scss";
import XBHeader from "../util/XBHeader";
import Enroller from "./components/Enroller";
import GroupInfo from "./components/GroupInfo";
import Disclaimer from "./components/Disclaimer";
import UserProfile from "../UserProfile/UserProfile";

const MovePage = (props) => {
  props.controllers.LOAD_TEAMS_IF_REQD();
  if (!props.teams.teams.bybox) {
    return <IonSpinner class="center-spin" name="crescent" />;
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
          match={props.match}
          controllers={props.controllers}
        />
        <Disclaimer checkbox={false} />
      </>
    );
  }

  return (
    <IonPage>
      <XBHeader title="Your Progress"></XBHeader>
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
    };
  },
  {
    // Actions to include as props
  }
)(addControllersProp(MovePage));
