import * as Realm from "realm-web";

const REALM = Realm.getApp("xbframework-yvulh");
const DB = REALM.currentUser.mongoClient("mongodb-atlas").db("SUMMER22");

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
    return clean(await method(...args));
  };
};

export const getModules = wrap(async () => {
  const modules = await DB.collection("modules").find();
  const enrollments = await DB.collection("enrollments").find({
    userId: REALM.currentUser.id,
  });

  const enrollmentsByModule = {};
  for (const enrollment of enrollments) {
    let enrollmentsForModule = enrollmentsByModule[enrollment.moduleId];
    if (!enrollmentsForModule) {
      enrollmentsForModule = enrollmentsByModule[enrollment.moduleId] = [];
    }

    enrollmentsForModule.push(enrollment);
  }

  return modules.map((item) => {
    const enrollmentsForModule = enrollmentsByModule[item._id];
    if (enrollmentsForModule) {
      item.enrollments = enrollmentsForModule;
    } else {
      item.enrollments = [];
    }

    return item;
  });
});

export const enrollToModule = wrap(async (moduleId) => {
  const xbModule = await DB.collection("modules").findOne({
    _id: Realm.BSON.ObjectId(moduleId),
  });

  if (!xbModule) {
    throw new Error("Module not found");
  }

  const document = { moduleId, responses: [] };

  const { insertedId } = await DB.collection("enrollments").insertOne({
    userId: REALM.currentUser.id,
    ...document,
  });

  return {
    _id: insertedId,
    ...document,
  };
});

export const idToCreationTs = function (id) {
  return Realm.BSON.ObjectId(id).getTimestamp();
};

export const updateResponse = wrap(
  async (payload, enrollmentId, playlistId, taskId) => {
    await DB.collection("enrollments").updateOne(
      {
        _id: Realm.BSON.ObjectId(enrollmentId),
      },
      {
        $set: {
          [`responses.${playlistId}.${taskId}`]: { payload, completedAt: null },
        },
      }
    );
  }
);
