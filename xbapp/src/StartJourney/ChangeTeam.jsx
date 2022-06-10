import { IonSpinner, IonContent, IonPage } from "@ionic/react";
import { connect } from "react-redux";

import XBHeader from "../util/XBHeader";
import { addControllersProp } from "../util_model/controllers";
import CreateJoinTeamCard from "./components/CreateJoinTeamCard";
import { getCurrentExperimentId } from "../util/util";

/**
 *
 * @param teams
 * @param controllers
 * @returns {JSX.Element}
 * @constructor
 */
function ChangeTeam({ teams, controllers }) {
  controllers.LOAD_TEAMS_IF_REQD();

  if (!teams.loaded) {
    return <IonSpinner class="center-spin" name="crescent" />;
  }

  const expid = getCurrentExperimentId("move");

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
