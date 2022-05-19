import { IonSpinner, IonContent, IonPage } from "@ionic/react";
import { connect } from "react-redux";

import Enroller from "../Boxes/components/Enroller";
import XBHeader from "../util/XBHeader";
import { addControllersProp } from "../util_model/controllers";
import CreateJoinTeamCard from "./components/CreateJoinTeamCard";

function ChangeTeam({ teams, controllers }) {
  controllers.LOAD_TEAMS_IF_REQD();

  if (!teams.loaded) {
    return <IonSpinner class="center-spin" name="crescent" />;
  }

  // TODO: add function to get current expid
  const expid = "6202d10ccc5d2aa4b830856d";

  return (
    <>
      <IonPage>
        <XBHeader title="Change Team" />
        <IonContent>
          <CreateJoinTeamCard expid={expid} />
        </IonContent>
      </IonPage>
    </>
  );
}

export default connect((state, ownProps) => {
  return {
    teams: state.teams,
  };
}, {})(addControllersProp(ChangeTeam));
