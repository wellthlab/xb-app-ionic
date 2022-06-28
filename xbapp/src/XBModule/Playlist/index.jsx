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
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";

import TaskListItem from "../components/TaskListItem";
import TaskList from "../components/TaskList";
import NavigationButton from "../components/NavigationButton";
import Task from "./Task";

const Playlist = function ({ playlists }) {
  const { playlistIdx, taskIdx } = useParams();
  const playlist = playlists[playlistIdx];
  const task = playlist.tasks[taskIdx];

  const accordionRef = React.useRef();

  const handleItemClick = function () {
    if (!accordionRef.current) {
      return;
    }

    accordionRef.current.value = undefined;
  };

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
            <IonAccordionGroup ref={accordionRef}>
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
                  onItemClick={handleItemClick}
                  slot="content"
                />
              </IonAccordion>
            </IonAccordionGroup>
          </IonCardHeader>
        </IonCard>

        {/* Task content */}
        <Task task={task} />

        <IonGrid>
          <IonRow>
            <IonCol>
              <NavigationButton dir={-1} expand="block" />
            </IonCol>
            <IonCol>
              <NavigationButton dir={1} expand="block" />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Playlist;
