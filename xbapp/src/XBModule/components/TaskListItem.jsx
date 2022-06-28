import React from "react";
import { IonItem, IonIcon, IonLabel } from "@ionic/react";
import {
  barbellOutline,
  newspaperOutline,
  schoolOutline,
  stopwatchOutline,
  videocamOutline,
  flaskOutline,
  trailSignOutline,
  journalOutline,
  informationCircleOutline,
} from "ionicons/icons";

function getTaskIcon(verb) {
  switch (verb) {
    case "LEARN":
      return schoolOutline;
    case "MOVE":
      return barbellOutline;
    case "ANSWER":
      return newspaperOutline;
    case "WATCH":
      return videocamOutline;
    case "MEASURE":
      return stopwatchOutline;
    case "EXPERIMENT":
      return flaskOutline;
    case "FOLLOW":
      return trailSignOutline;
    case "JOURNAL":
      return journalOutline;
    default:
      return informationCircleOutline;
  }
}

const TaskListItem = function ({ verb, name, ...props }) {
  return (
    <IonItem lines="none" {...props}>
      <IonIcon slot="start" icon={getTaskIcon(verb)} />
      <IonLabel>{name}</IonLabel>
    </IonItem>
  );
};

export default TaskListItem;
