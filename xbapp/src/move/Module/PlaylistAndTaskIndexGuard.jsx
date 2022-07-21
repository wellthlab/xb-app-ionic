import React from "react";
import { useParams, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectPlaylists, selectTaskStatuses } from "../slice";

const PlaylistAndTaskIndexGuard = function ({ children }) {
  const { moduleId, playlistIndex, taskIndex } = useParams();

  const playlists = useSelector((state) => selectPlaylists(state, moduleId));
  const taskStatuses = useSelector((state) =>
    selectTaskStatuses(state, moduleId)
  );

  const task = playlists[playlistIndex]?.tasks[taskIndex];

  if (!task || taskStatuses[playlistIndex][taskIndex].status === "LOCKED") {
    return <Redirect to={`/move/${moduleId}`} />;
  }

  return children;
};

export default PlaylistAndTaskIndexGuard;
