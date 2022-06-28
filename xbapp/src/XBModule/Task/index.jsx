import React from "react";
import { useParams } from "react-router-dom";
import {
  IonPage,
  IonContent,
  IonCardTitle,
  IonCardHeader,
  IonCard,
  IonCardSubtitle,
  IonAccordion,
  IonAccordionGroup,
} from "@ionic/react";

import TaskListItem from "../components/TaskListItem";
import TaskList from "../components/TaskList";

const Task = function ({ playlists }) {
  const { playlistIdx, taskIdx } = useParams();
  const playlist = playlists[playlistIdx];
  const task = playlist.tasks[taskIdx];

  return (
    <IonPage>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{task.name}</IonCardTitle>
            <IonCardSubtitle>
              Playlist {playlistIdx + 1} of {playlists.length}
            </IonCardSubtitle>
            <IonCardSubtitle>{playlist.minutes} minutes</IonCardSubtitle>
            <IonAccordionGroup>
              <IonAccordion className="ion-margin-top">
                <TaskListItem
                  slot="header"
                  color="primary"
                  name={task.name}
                  verb={task.verb}
                />
                <TaskList
                  tasks={playlist.tasks}
                  playlistIdx={playlistIdx}
                  slot="content"
                />
              </IonAccordion>
            </IonAccordionGroup>
          </IonCardHeader>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Task;
