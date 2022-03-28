import { IonSpinner, IonContent, IonPage } from "@ionic/react";
import { connect } from "react-redux";

import Enroller from "../Boxes/components/Enroller";
import XBHeader from "../util/XBHeader";
import { addControllersProp } from "../util_model/controllers";

function ChangeTeam({ teams, controllers }) {
  controllers.LOAD_TEAMS_IF_REQD();

  if (!teams.loaded) {
    return <IonSpinner class="center-spin" name="crescent" />;
  }

  return (
    <>
      <IonPage>
        <XBHeader title="Change Team" />
        <IonContent>
          <Enroller boxtype="move" seenDisclaimer={true} />
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
