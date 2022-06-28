import React from "react";
import { IonList } from "@ionic/react";
import { useParams } from "react-router-dom";

import TaskListItem from "./TaskListItem";

const TaskList = function ({ disableAllItems, playlistIdx, tasks, ...props }) {
  const { id } = useParams();

  return (
    <IonList {...props}>
      {tasks.map((task, taskIdx) => (
        <TaskListItem
          key={taskIdx}
          verb={task.verb}
          name={task.name}
          routerLink={`/move/modules/${id}/${playlistIdx}/${taskIdx}`}
          disabled={disableAllItems}
          detail
        />
      ))}
    </IonList>
  );
};

export default TaskList;
