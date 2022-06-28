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
  IonList,
} from "@ionic/react";

import TaskListItem from "../components/TaskListItem";
import NavigationButton from "../components/NavigationButton";
import useIdxBelt from "../hooks/useIdxBelt";
import Task from "./Task";

const Playlist = function ({ playlists }) {
  const { playlistIdx: rawPlaylistIdx, taskIdx: rawTaskIdx = 0 } = useParams();

  const playlistIdx = parseInt(rawPlaylistIdx, 10);
  const defaultTaskIdx = parseInt(rawTaskIdx, 10);
  const playlist = playlists[playlistIdx];
  const taskCount = playlist.tasks.length;
  const {
    idx: currentTaskIdx,
    set: setCurrentTaskIdx,
    prev,
    next,
  } = useIdxBelt(taskCount - 1, defaultTaskIdx);

  const accordionRef = React.useRef();
  const createItemClickHandler = function (idx) {
    return () => {
      setCurrentTaskIdx(idx);

      if (!accordionRef.current) {
        return;
      }

      accordionRef.current.value = undefined;
    };
  };

  const task = playlist.tasks[currentTaskIdx];

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
                <IonList slot="content">
                  {playlist.tasks.map((task, taskIdx) => (
                    <TaskListItem
                      key={taskIdx}
                      verb={task.verb}
                      name={task.name}
                      onClick={createItemClickHandler(taskIdx)}
                      button
                      detail
                    />
                  ))}
                </IonList>
              </IonAccordion>
            </IonAccordionGroup>
          </IonCardHeader>
        </IonCard>

        {/* Task content */}
        <Task task={task} />

        <IonGrid>
          <IonRow>
            <IonCol>
              <NavigationButton
                dir={-1}
                expand="block"
                onClick={prev}
                disabled={!currentTaskIdx}
              />
            </IonCol>
            <IonCol>
              <NavigationButton
                dir={1}
                expand="block"
                onClick={next}
                disabled={currentTaskIdx === taskCount - 1}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Playlist;
