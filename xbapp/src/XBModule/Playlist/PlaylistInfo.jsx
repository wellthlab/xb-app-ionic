import React from "react";
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

const PlaylistInfo = function ({
  task,
  playlist,
  playlistCount,
  playlistIdx,
  onItemClick,
}) {
  const accordionRef = React.useRef();
  const createItemClickHandler = function (idx) {
    return () => {
      onItemClick(idx);

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
          Playlist {playlistIdx + 1} of {playlistCount}
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
  );
};

export default PlaylistInfo;
