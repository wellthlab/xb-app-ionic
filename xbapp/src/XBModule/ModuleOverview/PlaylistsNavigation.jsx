import React from "react";
import { useRouteMatch } from "react-router-dom";
import {
  IonCard,
  IonGrid,
  IonCol,
  IonButton,
  IonIcon,
  IonCardTitle,
  IonCardHeader,
  IonRow,
  IonText,
  IonList,
} from "@ionic/react";
import { playOutline, calendarOutline } from "ionicons/icons";

import TaskListItem from "../components/TaskListItem";
import NavigationButton from "../components/NavigationButton";
import useIdxBelt from "../hooks/useIdxBelt";

const PlaylistsNavigation = function ({ playlists, currentPlaylistIdx }) {
  const { url } = useRouteMatch();

  const playlistCount = playlists.length;

  const { idx: playlistIdx, prev, next } = useIdxBelt(
    playlistCount - 1,
    currentPlaylistIdx
  );

  const playlist = playlists[playlistIdx];
  const allowAccessTasks = currentPlaylistIdx >= playlistIdx;

  let nextIncompleteTask;

  for (let i = 0; i < playlist.tasks.length; i++) {
    if (playlist.tasks[i].status === "incomplete") {
      nextIncompleteTask = i;
      break;
    }
  }

  return (
    <IonCard>
      <IonCardHeader>
        {/* Navigation buttons */}

        <IonGrid>
          <IonRow className="ion-justify-content-between ion-align-items-center">
            {/* Previous button */}

            <NavigationButton dir={-1} onClick={prev} disabled={!playlistIdx} />

            {/* Current playlist name */}

            <IonCardTitle className="ion-text-center">
              {playlist.name}
            </IonCardTitle>

            {/* Next button */}

            <NavigationButton
              dir={1}
              onClick={next}
              disabled={playlistIdx === playlistCount - 1}
            />
          </IonRow>
        </IonGrid>

        {/* Tasks */}

        <IonList>
          {playlist.tasks.map((task, taskIdx) => (
            <TaskListItem
              key={taskIdx}
              verb={task.verb}
              status={task.status}
              name={task.name}
              routerLink={`${url}/${playlistIdx}/${taskIdx}`}
              disabled={!allowAccessTasks}
              detail
            />
          ))}
        </IonList>

        <div className="ion-text-center ion-margin-top ion-margin-bottom">
          <IonText color="dark">
            <p>
              This playlist will take a maximum of {playlist.minutes} minutes to
              finish
            </p>
          </IonText>
          <p>Press play to start, or click a task to start from</p>
        </div>

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton
                expand="block"
                color="success"
                disabled={!allowAccessTasks}
                routerLink={`${url}/${playlistIdx}${
                  nextIncompleteTask ? `/${nextIncompleteTask}` : ""
                }`}
              >
                <IonIcon icon={playOutline} slot="start" />
                Play
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton expand="block" disabled={!allowAccessTasks}>
                <IonIcon icon={calendarOutline} slot="start" />
                Past
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
    </IonCard>
  );
};

export default PlaylistsNavigation;
