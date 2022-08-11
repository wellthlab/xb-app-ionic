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

import TaskListItem from "../components/TaskListItem";
import { selectPlaylists } from "../../slice";

const PlaylistInfo = function ({ taskIndex, onTaskChange }) {
  const { moduleId, playlistIndex, enrollmentIndex } = useParams();

  const playlists = useSelector((state) =>
    selectPlaylists(state, moduleId, enrollmentIndex)
  );

  const playlistCount = playlists.length;
  const playlist = playlists[playlistIndex];
  const task = playlist.tasks[taskIndex];

  const accordionRef = React.useRef();
  const createItemClickHandler = function (index) {
    return () => {
      onTaskChange(index);

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
          Playlist {parseInt(playlistIndex, 10) + 1} of {playlistCount}
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
              status={task.status}
            />
            <IonList slot="content">
              {playlist.tasks.map((task, currentTaskIndex) => (
                <TaskListItem
                  key={task.id}
                  icon={task.icon}
                  name={task.name}
                  status={task.status}
                  lockedUntil={task.until}
                  onClick={createItemClickHandler(currentTaskIndex)}
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
