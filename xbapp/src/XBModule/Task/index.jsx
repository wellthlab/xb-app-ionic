import React from "react";
import { useParams } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";

const Task = function ({ playlists }) {
  const { playlistIdx, taskIdx } = useParams();
  const task = playlists[playlistIdx].tasks[taskIdx];

  return (
    <IonPage>
      <IonContent>{task.name}</IonContent>
    </IonPage>
  );
};

export default Task;
