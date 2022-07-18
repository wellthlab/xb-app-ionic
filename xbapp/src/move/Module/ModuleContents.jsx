import React from "react";
import { useRouteMatch, useParams, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  IonPage,
  IonContent,
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
import { playOutline } from "ionicons/icons";

import ModuleOverview from "./components/ModuleOverview";
import TaskListItem from "../components/TaskListItem";
import NavigationButton from "../components/NavigationButton";
import useCarousel from "../hooks/useCarousel";
import {
  selectModuleById,
  selectTaskStatuses,
  selectCurrentPlaylistId,
} from "../slice";

const ModuleContents = function () {
  const { url } = useRouteMatch();

  const { moduleId, enrollmentId } = useParams();

  const { playlists } = useSelector((state) =>
    selectModuleById(state, moduleId)
  );

  const currentPlaylistId = useSelector((state) =>
    selectCurrentPlaylistId(state, moduleId, enrollmentId)
  );

  const playlistCount = playlists.length;
  const [playlistId, prev, next] = useCarousel(
    playlistCount - 1,
    currentPlaylistId
  );
  const playlist = playlists[playlistId];

  const taskStatuses = useSelector((state) =>
    selectTaskStatuses(state, moduleId, playlistId, enrollmentId)
  );

  // Invalid enrollmentId

  if (currentPlaylistId === undefined) {
    return <Redirect to={`/move/${moduleId}`} />;
  }

  return (
    <IonPage>
      <IonContent>
        <ModuleOverview />
        <IonCard>
          <IonCardHeader>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <NavigationButton
                    dir={-1}
                    onClick={prev}
                    expand="block"
                    disabled={!playlistId}
                  />
                </IonCol>
                <IonCol>
                  <NavigationButton
                    dir={1}
                    onClick={next}
                    expand="block"
                    disabled={playlistId === playlistCount - 1}
                  />
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonCardTitle>{playlist.name}</IonCardTitle>

            {/* Tasks */}

            <IonList>
              {playlist.tasks.map((task, taskId) => (
                <TaskListItem
                  key={taskId}
                  icon={task.icon}
                  name={task.name}
                  status={taskStatuses[taskId].status}
                  routerLink={`${url}/${playlistId}/${taskId}`}
                  detail
                />
              ))}
            </IonList>

            <div className="ion-text-center ion-margin-top ion-margin-bottom">
              <IonText color="dark">
                <p>
                  This playlist will take a maximum of{" "}
                  {playlist.duration.magnitude} {playlist.duration.unit} to
                  finish
                </p>
              </IonText>
              <p>Press play to start, or click a task to start from</p>
            </div>

            <IonButton
              expand="block"
              color="primary"
              routerLink={`${url}/${playlistId}`}
            >
              <IonIcon icon={playOutline} slot="start" />
              Play
            </IonButton>
          </IonCardHeader>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ModuleContents;
