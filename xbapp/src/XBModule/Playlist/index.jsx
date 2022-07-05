import React from "react";
import { useParams } from "react-router-dom";
import { IonPage, IonContent, IonSpinner } from "@ionic/react";

import PlaylistInfo from "./PlaylistInfo";
import Task from "./Task";
import useIdxBelt from "../hooks/useIdxBelt";
import useAsync from "../../util/useAsync";
import * as Summer22Controller from "../../controllers/summer22";

const Playlist = function ({ playlists }) {
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

  const { l, e, act, result: responses, setResult: setResponses } = useAsync();

  React.useEffect(() => {
    act(Summer22Controller.getResponses({ moduleId, playlistId: playlistIdx }));
  }, [moduleId, playlistIdx]);

  const handleTaskChange = function (dir, payload) {
    const newResponses = [...responses];
    let currentResponse = newResponses[currentTaskIdx];
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

    newResponses[currentTaskIdx] = currentResponse;
    setResponses(newResponses);

    if (dir === -1) {
      prev();
    } else {
      next();
    }
  };

  if (l) {
    return <IonSpinner className="center-spin" name="crescent" />;
  }

  if (e) {
    return <div>Errored whilst loading responses</div>;
  }

  const task = playlist.tasks[currentTaskIdx];

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
          response={responses[currentTaskIdx]}
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
