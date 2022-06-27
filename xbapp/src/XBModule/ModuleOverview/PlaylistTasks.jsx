import React from "react";
import { useRouteMatch } from "react-router";
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

const PlaylistTask = function ({ currentPlaylistIdx, playlistIdx, tasks }) {
  const { url } = useRouteMatch();

  return (
    <IonList>
      {tasks.map((task, taskIdx) => (
        <IonItem
          key={taskIdx}
          lines="none"
          href={`${url}/${playlistIdx}/${taskIdx}`}
          button
          detail
          disabled={currentPlaylistIdx < playlistIdx}
        >
          <IonIcon slot="start" icon={getTaskIcon(task.verb)} />
          <IonLabel>{task.name}</IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};

export default PlaylistTask;
