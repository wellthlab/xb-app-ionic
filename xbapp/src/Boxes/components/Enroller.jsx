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
  let expid;
  switch (boxtype) {
    case "move":
      expid = "6202d10ccc5d2aa4b830856d";
      break;
    case "eat":
    default:
      expid = "";
      break;
  }

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
    <IonCard>
      <IonItem lines="none" color="transparent" className="ion-text-justify">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText className="ion-text-center ion-text-justify">
                To get started you can either start a new team, or join somebody
                else's. If you start a new team, you can keep it just for you,
                or invite other people to join you.
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <div className="centering">
                <br />
                <IonButton
                  routerLink={"/start/join/" + expid}
                  onClick={() => {
                    if (setDoneEverything) setDoneEverything();
                  }}
                  size="regular"
                >
                  Join a Team
                </IonButton>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <div className="centering">
                <IonButton
                  routerLink={"/start/create/" + expid}
                  onClick={() => {
                    if (setDoneEverything) setDoneEverything();
                  }}
                  size="regular"
                >
                  Start a Team
                </IonButton>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </IonCard>
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
