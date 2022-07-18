import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  IonCard,
  IonList,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
} from "@ionic/react";

import ModulesListItem from "./ModulesListItem";
import {
  selectModuleIdsByTopic,
  selectModulesStatus,
  loadModules,
} from "../../slice";

const capitalise = function (str) {
  return str[0].toUpperCase() + str.slice(1);
};

const ModulesList = function () {
  const moduleIdsByTopic = useSelector(selectModuleIdsByTopic);
  const status = useSelector(selectModulesStatus);

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (status === "idle") {
      dispatch(loadModules());
    }
  }, []);

  if (status === "pending" || status === "idle") {
    return <IonSpinner name="crescent" />;
  }

  if (status === "rejected") {
    return "Sorry, we cannot retrieve available modules at the moment.";
  }

  return moduleIdsByTopic.map(([topic, moduleIds]) =>
    !moduleIds.length ? null : (
      <IonCard key={topic}>
        <IonCardHeader>
          <IonCardTitle>{capitalise(topic)}</IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
          <IonList>
            {moduleIds.map((id) => (
              <ModulesListItem key={id} id={id} />
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>
    )
  );
};

export default ModulesList;
