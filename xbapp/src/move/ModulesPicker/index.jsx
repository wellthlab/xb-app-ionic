import React from "react";
import { IonPage, IonContent } from "@ionic/react";

import ExperimentInfo from "./ExperimentInfo";
import ModulesList from "./ModulesList";
import XBHeader from "../../util/XBHeader";

const ModulesPicker = function () {
  return (
    <IonPage>
      <XBHeader title="Move" />
      <IonContent>
        <ExperimentInfo />
        <ModulesList />
      </IonContent>
    </IonPage>
  );
};

export default ModulesPicker;
