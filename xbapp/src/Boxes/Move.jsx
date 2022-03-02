import { IonContent, IonPage, IonSpinner } from "@ionic/react";
import XBHeader from "../util/XBHeader";
import Enroller from "./components/Enroller";
import GroupInfo from "./components/GroupInfo";
import "./Move.scss";
import { connect } from "react-redux";
import { addControllersProp } from "../util_model/controllers";

import Disclaimer from "./components/Disclaimer";

const MovePage = (props) => {
  props.controllers.LOAD_TEAMS_IF_REQD();
  if (!props.teams.teams.bybox) {
    return <IonSpinner class="center-spin" name="crescent" />;
  }

  // Ask the user to enrol in a move experiment; or show current experiment info
  if (!props.teams.teams.bybox["move"]) {
    var content = <Enroller boxtype="move" />;
  } else {
    var content = (
      <>
        <GroupInfo
          group={props.teams.teams.bybox["move"][0]}
          match={props.match}
        ></GroupInfo>
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
    };
  },
  {
    // Actions to include as props
  }
)(addControllersProp(MovePage));
