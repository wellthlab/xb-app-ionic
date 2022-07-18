import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonAccordion,
  IonAccordionGroup,
  IonList,
} from "@ionic/react";

import TaskListItem from "../../components/TaskListItem";
import { selectModuleById, selectTaskStatuses } from "../../slice";

const PlaylistInfo = function ({ taskId, onTaskChange }) {
  const { moduleId, playlistId, enrollmentId } = useParams();

  const { playlists } = useSelector((state) =>
    selectModuleById(state, moduleId)
  );

  const taskStatuses = useSelector((state) =>
    selectTaskStatuses(state, moduleId, playlistId, enrollmentId)
  );

  const playlistCount = playlists.length;
  const playlist = playlists[playlistId];
  const task = playlist.tasks[taskId];

  const accordionRef = React.useRef();
  const createItemClickHandler = function (id) {
    return () => {
      onTaskChange(id);

      if (!accordionRef.current) {
        return;
      }

      accordionRef.current.value = undefined;
    };
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{task.name}</IonCardTitle>
        <IonCardSubtitle>
          Playlist {parseInt(playlistId, 10) + 1} of {playlistCount}
        </IonCardSubtitle>
        <IonCardSubtitle>
          {playlist.duration.magnitude} {playlist.duration.unit}
        </IonCardSubtitle>
        <IonAccordionGroup ref={accordionRef}>
          <IonAccordion className="ion-margin-top">
            <TaskListItem
              slot="header"
              color="primary"
              name={task.name}
              icon={task.icon}
              status={taskStatuses[taskId].status}
            />
            <IonList slot="content">
              {playlist.tasks.map((task, currentTaskId) => (
                <TaskListItem
                  key={currentTaskId}
                  icon={task.icon}
                  name={task.name}
                  status={taskStatuses[currentTaskId].status}
                  onClick={createItemClickHandler(currentTaskId)}
                  button
                  detail
                />
              ))}
            </IonList>
          </IonAccordion>
        </IonAccordionGroup>
      </IonCardHeader>
    </IonCard>
  );
};

export default PlaylistInfo;
