import React from "react";
import { useRouteMatch, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  IonPage,
  IonContent,
  IonCard,
  IonButton,
  IonIcon,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonRow,
  IonText,
  IonList,
} from "@ionic/react";
import { playOutline } from "ionicons/icons";

import ModuleOverview from "./components/ModuleOverview";
import TaskListItem from "./components/TaskListItem";
import NavigationButton from "./components/NavigationButton";
import useCarousel from "./hooks/useCarousel";
import { selectPlaylists, selectTaskStatuses } from "../slice";

const ModuleContents = function () {
  const { url } = useRouteMatch();

  const { moduleId, enrollmentIndex } = useParams();

  const playlists = useSelector((state) =>
    selectPlaylists(state, moduleId, enrollmentIndex)
  );

  const playlistCount = playlists.length;
  const [playlistIndex, prev, next] = useCarousel(playlistCount - 1, 0);
  const playlist = playlists[playlistIndex];

  const taskStatuses = useSelector((state) =>
    selectTaskStatuses(state, moduleId)
  );

  console.log(taskStatuses);

  let nextPlayableTaskIndex;

  for (let i = 0; i < playlist.tasks.length; i++) {
    if (taskStatuses[playlistIndex][i].status !== "LOCKED") {
      nextPlayableTaskIndex = i;
    }
  }

  return (
    <IonPage>
      <IonContent>
        <ModuleOverview />
        <IonCard>
          <IonCardHeader>
            <IonRow className="ion-justify-content-between ion-align-items-center">
              <NavigationButton
                dir={-1}
                onClick={prev}
                disabled={!playlistIndex}
              />

              <IonCardTitle>{playlist.name}</IonCardTitle>

              <NavigationButton
                dir={1}
                onClick={next}
                disabled={playlistIndex === playlistCount - 1}
              />
            </IonRow>
          </IonCardHeader>

          {/* Tasks */}
          <IonCardContent>
            <IonList>
              {playlist.tasks.map((task, taskIndex) => (
                <TaskListItem
                  key={task.id}
                  icon={task.icon}
                  name={task.name}
                  status={taskStatuses[playlistIndex][taskIndex].status}
                  lockedUntil={taskStatuses[playlistIndex][taskIndex].until}
                  routerLink={`${url}/${playlistIndex}/${taskIndex}`}
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
              routerLink={`${url}/${playlistIndex}/${nextPlayableTaskIndex}`}
              disabled={nextPlayableTaskIndex === undefined}
            >
              <IonIcon icon={playOutline} slot="start" />
              Play
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ModuleContents;
