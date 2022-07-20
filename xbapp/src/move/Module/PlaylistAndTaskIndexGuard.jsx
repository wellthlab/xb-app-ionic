import React from "react";
import { useParams, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectPlaylists } from "../slice";

const PlaylistAndTaskIndexGuard = function ({ children }) {
  const { moduleId, enrollmentIndex, playlistIndex, taskIndex } = useParams();

  const playlists = useSelector((state) =>
    selectPlaylists(state, moduleId, enrollmentIndex)
  );

  const task = playlists[playlistIndex]?.tasks[taskIndex];

  if (!task || task.status === "LOCKED") {
    return <Redirect to={`/move/${moduleId}/${enrollmentIndex}`} />;
  }

  return children;
};

export default PlaylistAndTaskIndexGuard;
