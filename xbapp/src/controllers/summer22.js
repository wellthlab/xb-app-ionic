import * as Realm from "realm-web";

import { REALM, CLIENT } from "./shared";

const {
  BSON: { ObjectID },
} = Realm;

export const EXPERIMENT_ID = "62b8e14bba27603a69fb1875";

const DB = REALM.currentUser.mongoClient(CLIENT).db("SUMMER22");

export const getModule = async function (id) {
  const xbModule = await DB.collection("modules").findOne({
    _id: ObjectID(id),
    experiment_id: EXPERIMENT_ID,
  });

  const responses = await DB.collection("responses").find({
    user_id: REALM.currentUser.id,
    module_id: id,
  });

  // Sort responses

  const responsesByPlaylist = [];
  for (const response of responses) {
    let responsesByTask = responsesByPlaylist[response.playlist_id];
    if (!responsesByTask) {
      responsesByTask = responsesByPlaylist[response.playlist_id] = [];
    }

    responsesByTask[response.task_id] = response;
  }

  // Calculate status (NEEDS REFACTOR)

  for (let i = 0; i < xbModule.playlists.length; i++) {
    let locked = false;
    for (let j = 0; j < xbModule.playlists[i].tasks.length; j++) {
      const task = xbModule.playlists[i].tasks[j];

      const response = responsesByPlaylist[i]
        ? responsesByPlaylist[i][j]
        : null;

      if (response) {
        task.status = "completed";
        continue;
      }

      if (locked) {
        task.status = "locked";
        continue;
      }

      task.status = "incomplete";

      if (task.constraint) {
        if (task.constraint.type === "DELAY") {
          // Ignore DELAY constraint type if on the first task - Likely to be an error

          if (j === 0) {
            continue;
          }

          const prevResponse = responsesByPlaylist[i]
            ? responsesByPlaylist[i][j - 1]
            : null;

          const previousTimestamp = prevResponse
            ? prevResponse._id.getTimestamp().getTime()
            : null;

          if (
            !previousTimestamp ||
            Date.now() < previousTimestamp + task.constraint.ms
          ) {
            task.constraint.previousTimestamp = previousTimestamp;
            task.status = "locked";
            locked = true;
            continue;
          }

          delete task.constraint;
        }
      }
    }
  }

  xbModule.responses = responsesByPlaylist;

  return xbModule;
};

export const getSubscriptions = function () {
  return DB.collection("subscriptions").findOne({
    user_id: REALM.currentUser.id,
  });
};

export const insertResponse = function ({
  moduleId,
  playlistId,
  taskId,
  ...payload
}) {
  return DB.collection("responses").insertOne({
    user_id: REALM.currentUser.id,
    module_id: moduleId,
    playlist_id: playlistId,
    task_id: taskId,
    ...payload,
  });
};

export const updateResponse = function ({
  moduleId,
  playlistId,
  taskId,
  ...payload
}) {
  if (Object.keys(payload).length) {
    return DB.collection("responses").updateOne(
      {
        user_id: REALM.currentUser.id,
        module_id: moduleId,
        playlist_id: playlistId,
        task_id: taskId,
      },
      { $set: payload }
    );
  }
};
