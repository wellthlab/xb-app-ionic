/**
 * Present enrollment options for a box/experiment. This is a convenience widget
 * that kicks off the /start/ flow.
 *
 * @arg boxtype: The box type that can be enrolled in
 */

import { IonButton } from "@ionic/react";
import React, { useState } from "react";
import "./Enroller.scss";

import { connect } from "react-redux";

const Enroller = ({ boxtype, expid }) => {
  // Look up experiment ID based on box type
  // TODO: Eventually we'll want to look these up?
  switch (boxtype) {
    case "move":
      var expid = "6113efcc978250a1cfa59a5e";
      break;
    case "eat":
      var expid = "";
      break;
  }

  return (
    <>
      <p className="centering">
        To get started you can either start a new team, or join somebody else's.
        If you start a new team, you can keep it just for you, or invite other
        people to join you.
      </p>

      <div className="centering">
        <br />
        <IonButton routerLink={"/start/join/" + expid}>Join a Team</IonButton>
      </div>

      <div className="centering">
        <IonButton routerLink={"/start/create/" + expid}>
          Start a Team
        </IonButton>
      </div>
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
