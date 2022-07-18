import React from "react";
import { useParams, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IonPage, IonContent } from "@ionic/react";

import PlaylistInfo from "./PlaylistInfo";
import Task from "./Task";
import useCarousel from "../../hooks/useCarousel";
import {
  selectModuleById,
  selectTaskStatuses,
  updateResponse,
} from "../../slice";

const PlaylistPlayer = function () {
  const {
    moduleId,
    enrollmentId,
    playlistId: rawPlaylistId,
    startTaskId: rawStartTaskId,
  } = useParams();

  const playlistId = parseInt(rawPlaylistId, 10);
  const startTaskId = parseInt(rawStartTaskId, 10);

  const { playlists } = useSelector((state) =>
    selectModuleById(state, moduleId)
  );

  const playlist = playlists[playlistId];

  const taskStatuses = useSelector((state) =>
    selectTaskStatuses(state, moduleId, playlistId, enrollmentId)
  );

  console.log({ taskStatuses });

  let defaultStartTaskId = startTaskId;
  if (!defaultStartTaskId && taskStatuses) {
    for (let i = 0; i < taskStatuses.length; i++) {
      if (taskStatuses[i].status === "INCOMPLETE") {
        defaultStartTaskId = i;
      }
    }
  }

  const [taskId, prev, next, setTaskId] = useCarousel(
    playlist ? playlist.tasks.length - 1 : 0,
    defaultStartTaskId
  );

  const [disableNavigation, setDisableNavigation] = React.useState(false);
  const dispatch = useDispatch();
  const handleTaskChange = async function (dir, values) {
    setDisableNavigation(true);
    await dispatch(
      updateResponse({ payload: values, enrollmentId, playlistId, taskId })
    );

    setDisableNavigation(false);

    if (dir === -1) {
      prev();
    } else {
      next();
    }
  };

  // This check guarantees correct playlistId

  if (!taskStatuses) {
    return <Redirect to={`/move/${moduleId}`} />;
  }

  const task = playlist.tasks[startTaskId];

  if (!task) {
    return <Redirect to={`/move/${moduleId}/${enrollmentId}`} />;
  }

  if (taskStatuses[taskId].status === "LOCKED") {
    return <Redirect to={`/move/${moduleId}/${enrollmentId}`} />;
  }

  return (
    <IonPage>
      <IonContent>
        <PlaylistInfo taskId={taskId} onTaskChange={setTaskId} />
        {/* Add key to force update task to refresh state */}
        <Task taskId={taskId} key={taskId} onTaskChange={handleTaskChange} disableNavigation={disableNavigation} />
      </IonContent>
    </IonPage>
  );
};

export default PlaylistPlayer;
