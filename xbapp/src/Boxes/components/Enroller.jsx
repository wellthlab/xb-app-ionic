/**
 * Present enrollment options for a box/experiment. This is a convenience widget
 * that kicks off the /start/ flow.
 *
 * @arg boxtype: The box type that can be enrolled in
 */

import {
  IonButton,
  IonGrid,
  IonItem,
  IonCol,
  IonRow,
  IonText,
  IonCard,
} from "@ionic/react";
import React, { useState } from "react";
import "./Enroller.scss";

import Disclaimer from "./Disclaimer";
import Consent from "./Consent";
import SetUserProfile from "../../UserProfile/SetUserProfile";

import { connect } from "react-redux";
import CreateJoinTeamCard from "../../StartJourney/components/CreateJoinTeamCard";
import { getCurrentExperimentId } from "../../util/util";

/**
 *
 * @param boxtype
 * @param expid
 * @param seenDisclaimer
 * @returns {JSX.Element}
 * @constructor
 */
const Enroller = ({
  boxtype,
  setDoneEverything,
  setProfile = false,
  seenConsent = false,
  seenDisclaimer = false,
}) => {
  const [disclaimed, setDisclaimed] = useState(seenDisclaimer);
  const [consented, setConsented] = useState(seenConsent);
  const [setUpProfile, setSetUpProfile] = useState(setProfile);

  // Look up experiment ID based on box type
  const expid = getCurrentExperimentId(boxtype);

  if (!consented) {
    return (
      <IonCard>
        <Consent setConsented={setConsented} />
      </IonCard>
    );
  }

  if (!disclaimed) {
    return (
      <IonCard>
        <Disclaimer checkbox={true} onToggle={setDisclaimed} />
      </IonCard>
    );
  }

  if (!setUpProfile) {
    return (
      <IonCard>
        <SetUserProfile pageType="move" setSetUpProfile={setSetUpProfile} />
      </IonCard>
    );
  }

  return (
    <CreateJoinTeamCard expid={expid} setDoneEverything={setDoneEverything} />
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
)(Enroller);
