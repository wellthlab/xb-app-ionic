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
