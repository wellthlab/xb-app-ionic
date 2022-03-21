/**
 * Client for interacting with the server component
 * Based on MongoDB realm client
 */
import "abortcontroller-polyfill/dist/polyfill-patch-fetch";
import "babel-polyfill";
import "react-app-polyfill/stable";
// Use the realm WebSDK because we're effectively operating in a web browser
import * as Realm from "realm-web";

import { ObjectId } from "bson";

var crypto = require("crypto");

function sha512(str) {
  var hash = crypto.createHash("sha512");
  var data = hash.update(str, "utf-8");
  return data.digest("hex");
}

function isValidEmail(email) {
  const regex =
    /((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))/g;
  return regex.test(email);
}

/**
 * Most methods are async and return promises; so the intended style would be something
 * like:
 *            client.getExperiments().then(redux.action.setExperiments);
 */
function XBClient() {
  var self = this;

  var APP_ID = "xbframework-yvulh";
  var ATLAS_APP = "mongodb-atlas";
  var MONGO_DB = "V2";

  self.realm = new Realm.App({ id: APP_ID, timeout: 10000 });

  console.log("Created realm client", self.realm);

  var checkOpts = function (opts, reqOpts, defOpts) {
    reqOpts.map(function (k) {
      if (typeof opts[k] == "undefined")
        throw "Required option '" + k + "' is not set";
    });

    Object.keys(defOpts).map(function (k) {
      if (typeof opts[k] == "undefined") opts[k] = defOpts[k];
    });
  };

  // Get a configured GraphQL client
  var _db = false;
  var getDb = function () {
    if (_db !== false) {
      return _db;
    }

    if (!self.realm.currentUser.accessToken) {
      throw "Cannot use DB until autenticated with realm";
    }

    //console.log("services", self.realm.services);
    //console.log("currentUser", self.realm.currentUser);
    //console.log("currentUser.mongoclient", self.realm.currentUser.mongoClient);

    // In non-web mode
    var svc;
    if (self.realm.currentUser.mongoClient) {
      svc = self.realm.currentUser.mongoClient(ATLAS_APP);
    }
    // In web mode
    else if (self.realm.services) {
      svc = self.realm.services.mongodb(ATLAS_APP);
    }

    var db = svc.db(MONGO_DB);

    return db;
  };

  var string2ID = function (id) {
    return new ObjectId(id);
  };

  self.register = async function (email, password, data) {
    await self.realm.emailPasswordAuth.registerUser(email, sha512(password));
    return await self.setUser(email, password);
  };

  self.forgotPassword = async function (email) {
    try {
      if (isValidEmail(email)) {
        await self.realm.emailPasswordAuth.sendResetPasswordEmail(email);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw Error(err.message);
    }
  };

  //TODO add return types for failures
  self.resetPassword = async function (token, tokenId, password) {
    console.log(token, tokenId, password, sha512(password));
    try {
      await self.realm.emailPasswordAuth.resetPassword(
        token,
        tokenId,
        sha512(password)
      );
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  };

  // Log in and set the realm user
  self.setUser = async function (email, password) {
    var cpw = await sha512(password);
    //console.log("Hash", cpw);
    const credentials = Realm.Credentials.emailPassword(email, cpw);
    try {
      const user = await self.realm.logIn(credentials);
      return user;
    } catch (err) {
      throw Error(err.message);
    }
  };

  self.getUser = function () {
    return self.realm.currentUser;
  };

  self.sortTeams = async function (monday) {

    const res = await self.realm.currentUser.functions.sortTeams(monday);
    self.tidy(res);
    return res;
  }

  /**
   * Get all modules
   */

  self.getModules = async function () {
    let db = getDb();
    let collection = db.collection("modules");
    let modules = await collection.find({})

    self.tidy(modules);

    return modules;
  }

  /**
   * Get all groups for the current user
   */
  self.getTeams = async function () {
    var db = getDb();

    var collection = db.collection("teams");

    var groups = await collection.find({
      users: {
        $elemMatch: {
          $eq: self.realm.currentUser.id,
        },
      },
    });

    self.tidy(groups);

    // Add experiment info
    var exps = await self.getExperiments();
    var getEx = (id) => {
      for (var i in exps) {
        var e = exps[i];
        if (e._id == id) {
          return e;
        }
      }
      return false;
    };

    for (var i in groups) {
      var g = groups[i];
      g.experiment.info = getEx(g.experiment.experiment_id);
    }

    // Add response info
    var responses = await self.getOwnResponses();
    var getRes = (teamid) => {
      for (var i in responses) {
        var r = responses[i];
        if (r.team == teamid) {
          return r;
        }
      }
      return false;
    };

    for (var i in groups) {
      var g = groups[i];
      g.responses = {};
      var res = getRes(g._id);
      g.responses.own = res ? res : { responses: [] };
    }

    console.log("User teams", groups);

    return groups;
  };

  /**
   * Get all responses for a team
   */
  self.getTeamResponses = async function (teamid) {
    var info = await self.realm.users[0].functions.getTeamData(teamid);

    console.log("Fetched team responses", info, teamid);

    return self.tidy(info[0].allresponses);
  };

  // Helper function for generating a team ID
  function genID(len) {
    var result = "";
    var characters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    var charactersLength = characters.length;
    for (var i = 0; i < len; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * Create a new team
   */
  self.createTeam = async function (name, desc, expid, start, parentTeam) {
    var db = getDb();
    var collection = db.collection("teams");

    var code = genID(6);

    // Parent team defaults to none
    if (typeof parentTeam == 'undefined')
      //parentTeam = ""; needs to be a hexadecimal value for ObjectId conversion
      parentTeam = parentTeam;

    const team = {
      name: name,
      desc: desc,
      code: code,
      experiment: {
        experiment_id: string2ID(expid),
        start: start,
      },
      users: [self.realm.currentUser.id],
      parentTeam: string2ID(parentTeam)
    };

    try {
      const insertOneResult = await collection.insertOne(team);
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: "Sorry, we couldn't create a new team",
      };
    }

    return { success: true };
  };

  /**
   * Join the current user to the team identified by the given Team Code
   */
  self.joinTeam = async function (code) {
    try {
      return await self.realm.users[0].functions.joinTeam(code.toUpperCase());
    } catch (e) {
      console.log(e);
      return { success: false, message: "An unexpected error occured" }
    }
  };

  /**
   * Add a response for the given team
   */
  self.addResponse = async function (teamid, response) {
    var db = getDb();

    var collection = db.collection("responses");

    // This upsert creates the overal response list, if required
    const query = { team: string2ID(teamid), user: self.realm.currentUser.id };
    const update = { $push: { responses: response } };
    const options = { upsert: true };

    console.log("Attempt to save response", response);

    try {
      var result = await collection.updateOne(query, update, options);
      const { matchedCount, modifiedCount, upsertedId } = result;
    } catch (e) {
      console.log(e);
      return { success: false, message: e.message };
    }

    return { success: true };
  };

  /**
   * Get responses for the current user
   */
  self.getOwnResponses = async function () {
    var db = getDb();
    var collection = db.collection("responses");

    var responses = await collection.find({ user: self.realm.currentUser.id });

    self.tidy(responses);

    console.log("Own responses", responses);

    return responses;
  };

  /**
   * Get details of an experiment
   */
  self.getExperiments = async function (exid) {
    var db = getDb();

    var collection = db.collection("experiments");

    var exps = await collection.find({});

    return self.tidy(exps);
  };

  /**
   * Get a user profile
   */

  self.getUserProfile = async function (id = null) {
    const db = getDb();
    const collection = db.collection("usersDetails");

    if (id == null) {
      id = self.realm.currentUser.id;
    }

    const user = await collection.findOne({
        _userid: {$eq: id}
      }
    );

    if (user) {
      return self.tidy(user);
    }

    return user;
  }

  /**
     * Create a user profile
     */
  self.createUserProfile = async function (userProfile) {
    const db = getDb();
    const collection = db.collection("usersDetails");

    const newUserProfile = {
      _userid: self.realm.currentUser.id,
      ...userProfile,
    };

    delete newUserProfile._id;

    try {
      const updateOneResult = await collection.updateOne({
        _userid: {$eq: self.realm.currentUser.id}
      }, newUserProfile, {upsert: true});
    } catch (e) {
      console.error("Error updating user", e);
      return {
        success: false,
        message: "Sorry, we couldn't update your user profile"
      }
    }

    return { success: true }
  }

  /**
   * Progress a user along their module
   */

  self.progressUserModule = async function (moduleId) {
    const db = getDb();
    const userCollection = db.collection("usersDetails");
    const moduleCollection = db.collection("modules");
    const user = await userCollection.findOne({
        _userid: {$eq: self.realm.currentUser.id}
    })

    if (user === null) {
      console.error("Unable to find user to progress them along a module")
      return {
        success: false,
        message: "user profile doesn't exist"
      }
    }

    const moduleObjectId = new ObjectId(moduleId);
    const module = await moduleCollection.findOne({
      _id: { $eq: moduleObjectId }
    });

    if(module === null) {
      console.error("Trying to update a module which doesn't exist");
      return {
        success: false,
        message: "module doesn't exist"
      }
    }

    const numPlaylists = module.playlists.length;
    const stage = user.modules[moduleId].stage;
    const newStage  = stage >= numPlaylists - 1 ? stage : stage + 1;

    const updated = {
      ...user.modules
    }
    updated[moduleId].stage = newStage;

    try {
      const updateOneResult = await userCollection.updateOne({
        _userid: {$eq: self.realm.currentUser.id}
      }, {
        $set: {
          modules: updated
        }
      });
      console.log("Progressed user in module", module.name, "from", stage, "to stage", newStage);
    } catch (e) {
      console.error("Error updating user", e);
      return {
        success: false,
        message: "Sorry, we couldn't update your progress"
      }
    }

  }

  /**
   * Get the userProfile for all the users in a team
   */

   self.getTeamUserProfiles = async function (teamCode) {
    const db = getDb();
    const collection = db.collection("teams");
    const team = await collection.findOne({ code: {$eq: teamCode} });

    const users = [];
    for (let i in team.users) {
      let user = await self.getUserProfile(team.users[i]);
      if(user === null) {  // this happens when someone joins a team, but closes the app before creating their profile
        user = { prefName: "Unknown" };
      }

      users.push(user);
    }

    self.tidy(users);

    return users;
  }

  /**
   * Tidy up a result so it's safe to pass into redux with warnings about non-serializabilty
   *
   */
  self.tidy = function (result, depth) {
    if (typeof depth == "undefined") {
      depth = 0;
    }

    if (depth == 0) {
      //console.log("Tidy", result);
    }

    if (Array.isArray(result)) {
      for (var i in result) {
        result[i] = self.tidy(result[i], depth + 1);
      }
    } else if (typeof result == "object") {
      for (var k of Object.keys(result)) {
        var v = result[k];

        if (typeof v == "undefined" || v == null) continue;

        if (v.id && v.id instanceof Uint8Array) {
          // Picks up mongo object IDs
          result[k] = v.toString();
        } else {
          result[k] = self.tidy(result[k], depth + 1);
        }
      }
    }

    return result;
  };
}

var xbclient = false;
function getXBClient() {
  if (xbclient === false) {
    xbclient = new XBClient();
  }

  return xbclient;
}

export default getXBClient;
export { XBClient };
