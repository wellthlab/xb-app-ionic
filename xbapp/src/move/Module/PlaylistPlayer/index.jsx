import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IonPage, IonContent, useIonToast } from "@ionic/react";

import PlaylistInfo from "./PlaylistInfo";
import Task from "./Task";
import useCarousel from "../hooks/useCarousel";
import { selectPlaylists, saveResponse } from "../../slice";

const PlaylistPlayer = function () {
  const { moduleId, playlistIndex, taskIndex: startTaskIndex } = useParams();
  const history = useHistory();

  const playlists = useSelector((state) => selectPlaylists(state, moduleId));
  const playlist = playlists[playlistIndex];

  const [taskIndex, prev, next, setTaskIndex] = useCarousel(
    playlist ? playlist.tasks.length - 1 : 0,
    parseInt(startTaskIndex, 10)
  );

  const [disableNavigation, setDisableNavigation] = React.useState(false);
  const dispatch = useDispatch();
  const [present] = useIonToast();
  const handleTaskChange = async function (dir, values) {
    setDisableNavigation(true);

    try {
      await dispatch(
        saveResponse({ payload: values, taskIndex, playlistIndex, moduleId })
      ).unwrap();
    } catch (error) {
      console.log(error);
      present({
        message:
          "Sorry, cannot save your response at this time. Please try again",
        duration: 2000,
        color: "danger",
      });
    } finally {
      setDisableNavigation(false);
    }

    if (dir === -1) {
      prev();
    } else {
      if (taskIndex === playlist.tasks.length - 1) {
        history.push(`/move/${moduleId}`);
        return;
      }

      next();
    }
  };

  return (
    <IonPage>
      <IonContent>
        <PlaylistInfo taskIndex={taskIndex} onTaskChange={setTaskIndex} />
        {/* Add key to force update task to refresh state */}
        <Task
          taskIndex={taskIndex}
          key={playlist.tasks[taskIndex].id}
          onTaskChange={handleTaskChange}
          disableNavigation={disableNavigation}
        />
      </IonContent>
    </IonPage>
  );
};

export default PlaylistPlayer;
