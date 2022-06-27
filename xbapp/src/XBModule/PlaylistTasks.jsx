import React from "react";
import { IonItem, IonList, IonLabel, IonIcon } from "@ionic/react";
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

const PlaylistTask = function ({ tasks }) {
  return (
    <IonList>
      {tasks.map((task, taskIndex) => (
        <IonItem key={taskIndex} lines="none" button detail>
          <IonIcon slot="start" icon={getTaskIcon(task.verb)} />
          <IonLabel>{task.name}</IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};

export default PlaylistTask;
