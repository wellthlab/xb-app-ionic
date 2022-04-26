import React from "react";
import { IonPage, IonContent } from "@ionic/react";

import XBHeader from "../util/XBHeader";
import Visualisation from "./Visualisation";

const Teams = function () {
  return (
    <IonPage>
      <XBHeader title="Teams Leaderboard" />
      <IonContent>
        <Visualisation />
      </IonContent>
    </IonPage>
  );
};

export default Teams;
