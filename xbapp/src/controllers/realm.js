import * as Realm from "realm-web";

const REALM = Realm.getApp("xbframework-yvulh");

const clean = function (result) {
  if (Array.isArray(result)) {
    for (const item of result) {
      clean(item);
    }
  } else if (result !== null && typeof result === "object") {
    if (result._id instanceof Realm.BSON.ObjectId) {
      result.id = result._id.toString();
      delete result._id;
    }

    for (const item of Object.values(result)) {
      clean(item);
    }
  }

  return result;
};

const wrap = function (method) {
  return async (...args) => {
    const db = REALM.currentUser.mongoClient("mongodb-atlas").db("SUMMER22");
    return clean(await method(db, ...args));
  };
};

export const idToTs = function (id) {
  return new Realm.BSON.ObjectId(id).getTimestamp().getTime();
};

export const getModules = wrap(async (db) => {
  const modules = await db.collection("modules").find();
  const enrollments = await db.collection("enrollments").find({
    userId: REALM.currentUser.id,
  });

  const responses = await db.collection("responses").find({
    userId: REALM.currentUser.id,
  });

  const enrolledIds = new Set(enrollments.map(({ moduleId }) => moduleId));

  const responsesByModuleId = {};
  for (const response of responses) {
    let responsesForModule = responsesByModuleId[response.moduleId];
    if (!responsesForModule) {
      responsesForModule = responsesByModuleId[response.moduleId] = [];
    }

    responsesForModule.push(response);
  }

  return modules.map((item) => {
    if (enrolledIds.has(item._id.toString())) {
      item.enrolled = true;
    }

    item.responses = responsesByModuleId[item._id] || [];
    return item;
  });
});

export const enrollToModule = wrap(async (db, moduleId) => {
  const xbModule = await db.collection("modules").findOne({
    _id: Realm.BSON.ObjectId(moduleId),
  });

  if (!xbModule) {
    throw new ModuleNotFoundError("Module not found");
  }

  const enrollment = await db.collection("enrollments").findOne({
    moduleId,
    userId: REALM.currentUser.id,
  });

  if (enrollment) {
    return;
  }

  return db.collection("enrollments").insertOne({
    moduleId,
    userId: REALM.currentUser.id,
  });
});

export class ModuleNotFoundError extends Error {}

export const getResponses = wrap(async (db, moduleId) => {
  return db.collection("responses").find({
    moduleId,
    userId: REALM.currentUser.id,
  });
});

export const saveResponse = wrap(
  async (db, payload, moduleId, playlistIndex, taskIndex) => {
    const { upsertedId } = await db.collection("responses").updateOne(
      {
        userId: REALM.currentUser.id,
        moduleId,
        playlistIndex: parseInt(playlistIndex, 10),
        taskIndex: parseInt(taskIndex, 10),
      },
      { $set: { payload } },
      { upsert: true }
    );

    return { _id: upsertedId, payload, moduleId, playlistIndex, taskIndex };
  }
);
