import * as Realm from "realm-web";

import { REALM, CLIENT } from "./shared";

const {
  BSON: { ObjectID },
} = Realm;

export const EXPERIMENT_ID = "62b8e14bba27603a69fb1875";

const DB = REALM.currentUser.mongoClient(CLIENT).db("SUMMER22");

export const getModule = function (id) {
  return DB.collection("modules").findOne({
    _id: ObjectID(id),
    experiment_id: EXPERIMENT_ID,
  });
};

export const getSubscriptions = function () {
  return DB.collection("subscriptions").findOne({
    user_id: REALM.currentUser.id,
  });
};

export const getResponses = function ({ moduleId, playlistId }) {
  return DB.collection("responses").find({
    user_id: REALM.currentUser.id,
    module_id: moduleId,
    playlist_id: playlistId,
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
