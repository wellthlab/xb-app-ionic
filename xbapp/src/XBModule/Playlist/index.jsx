import React from "react";
import { useParams, Redirect } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";

import PlaylistInfo from "./PlaylistInfo";
import Task from "./Task";
import useIdxBelt from "../hooks/useIdxBelt";
import * as Summer22Controller from "../../controllers/summer22";

const Playlist = function ({ playlists, onResponseUpdate, responses }) {
  const {
    id: moduleId,
    playlistIdx: rawPlaylistIdx,
    taskIdx: rawTaskIdx = 0,
  } = useParams();

  const playlistIdx = parseInt(rawPlaylistIdx, 10);
  const defaultTaskIdx = parseInt(rawTaskIdx, 10);
  const playlist = playlists[playlistIdx];
  const taskCount = playlist.tasks.length;
  const { idx: currentTaskIdx, set: setTaskIdx, prev, next } = useIdxBelt(
    taskCount - 1,
    defaultTaskIdx
  );

  const handleTaskChange = function (dir, payload) {
    let currentResponse = responses[playlistIdx]
      ? responses[playlistIdx][currentTaskIdx]
      : null;
    if (!currentResponse) {
      currentResponse = {
        moduleId,
        playlistId: playlistIdx,
        taskId: currentTaskIdx,
        ...payload,
      };

      Summer22Controller.insertResponse(currentResponse);
    } else {
      currentResponse = { ...currentResponse, ...payload };
      Summer22Controller.updateResponse(currentResponse);
    }

    onResponseUpdate(playlistIdx, currentTaskIdx, currentResponse);

    if (dir === -1) {
      prev();
    } else {
      next();
    }
  };

  const task = playlist.tasks[currentTaskIdx];

  if (task.status === "locked") {
    return <Redirect to={`/move/modules/${moduleId}`} />;
  }

  return (
    <IonPage>
      <IonContent>
        <PlaylistInfo
          task={task}
          playlistCount={playlists.length}
          onItemClick={setTaskIdx}
          playlist={playlist}
          playlistIdx={playlistIdx}
        />
        <Task
          task={task}
          response={
            responses[playlistIdx]
              ? responses[playlistIdx][currentTaskIdx]
              : null
          }
          onTaskChange={handleTaskChange}
          isFirst={!currentTaskIdx}
          isLast={currentTaskIdx === taskCount - 1}
          moduleId={moduleId}
          playlistId={playlistIdx}
          key={currentTaskIdx}
        />
      </IonContent>
    </IonPage>
  );
};

export default Playlist;
