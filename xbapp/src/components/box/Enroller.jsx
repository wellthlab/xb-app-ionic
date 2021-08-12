/**
 * Present enrollment options for a box/experiment. This is a convenience widget
 * that kicks off the /start/ flow.
 *
 * @arg exid: The experiment ID of the experiment
 * @arg boxType: The type of box that can be joined; allows any kind if undefined
 */

import {
  IonButton
} from "@ionic/react";
import React, { useState } from "react";
import "./Enroller.scss";


const Enroller = (exid) => {
  return (
    <>
        <h1 className="centering">Hello!</h1>
        <p className="centering">
          To get started you can either start a new team, or join somebody
          else's. If you start a new team, you can keep it just for you, or
          invite other people to join you.
        </p>

        <div className="centering">
          <IonButton routerLink={"/start/create/" + exid}>
            Start a Team
          </IonButton>
        </div>
        <div className="centering">
          <br />
          <IonButton routerLink={"/start/join/" + exid}>
            Join a Team
          </IonButton>
        </div>
    </>
  );
};

export default Enroller;
