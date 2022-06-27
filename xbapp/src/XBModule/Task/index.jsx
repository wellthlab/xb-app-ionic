import React from "react";
import { useParams } from "react-router-dom";

const Task = function ({ playlists }) {
  const { playlistIdx, taskIdx } = useParams();
  const task = playlists[playlistIdx].tasks[taskIdx];

  return task.name;
};

export default Task;
