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

import { connect } from "react-redux";

const Enroller = ({ boxtype, expid, seenDisclaimer = false }) => {
  const [disclaimed, setDisclaimed] = useState(seenDisclaimer);

  // Look up experiment ID based on box type
  // TODO: Eventually we'll want to look these up?
  switch (boxtype) {
    case "move":
      var expid = "6202d10ccc5d2aa4b830856d"; // Strength in work Feb 2022
      break;
    case "eat":
    default:
      var expid = "";
      break;
  }

  const content = disclaimed ? (
    <>
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
                <IonButton routerLink={"/start/join/" + expid} size="regular">
                  Join a Team
                </IonButton>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <div className="centering">
                <IonButton routerLink={"/start/create/" + expid} size="regular">
                  Start a Team
                </IonButton>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </>
  ) : (
    <Disclaimer checkbox={true} onToggle={setDisclaimed} />
  );

  return (
    <>
      <IonCard>{content}</IonCard>
    </>
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
