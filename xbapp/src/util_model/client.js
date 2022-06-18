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

const crypto = require("crypto");
const sendEmail = require("@sendgrid/mail");

function sha512(str) {
  const hash = crypto.createHash("sha512");
  const data = hash.update(str, "utf-8");
  return data.digest("hex");
}

function isValidEmail(email) {
  const regex = /((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))/g;
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
  };

  self.deleteAccount = async function () {
    const db = getDb();

    const profile = await self.getUserProfile();
    const id = self.realm.currentUser.id;

    // Delete responses associated with this user

    await db.collection("responses").deleteMany({ user: id });

    // Delete user from teams, making the second joined member the owner

    await db.collection("teams").updateMany(
      {
        users: {
          $elemMatch: { $eq: id },
        },
      },
      {
        $pull: {
          users: id,
        },
      }
    );

    // Delete user details

    await db.collection("usersDetails").deleteMany({ _userid: id });

    await self.realm.currentUser.functions.sendWithdrawNotificationEmail(
      profile ? profile.prefName : null
    );

    // Delete user

    await self.realm.deleteUser(self.realm.currentUser);

    return { success: true };
  };

  /**
   * Get all modules
   */

  let _modules = undefined;
  self.getModules = async function () {
    if (_modules !== undefined) {
      return _modules;
    }

    let db = getDb();
    let collection = db.collection("modules");
    let modules = await collection.find({});

    self.tidy(modules);

    return modules;
  };

  self.getLibraryData = async function () {
    const db = getDb();
    const collection = db.collection("library");
    const data = await collection.find({});
    self.tidy(data);

    return data;
  };

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

    // console.log("User teams", groups);

    return groups;
  };

  /**
   * Get all responses for a team
   */
  self.getTeamResponses = async function (teamid) {
    // var info = await self.realm.users[0].functions.getTeamData(teamid);
    // console.log("Fetched team responses", info, teamid);
    // return self.tidy(info[0].allresponses);
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
    if (typeof parentTeam == "undefined")
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
      parentTeam: string2ID(parentTeam),
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
      return { success: false, message: "An unexpected error occured" };
    }
  };

  /**
   * Remove the current user from their team
   */
  self.leaveTeam = async function (code) {
    const db = getDb();
    const collection = db.collection("teams");
    const team = await collection.findOne({ code: { $eq: code } });

    if (!team) {
      return { success: false, message: "Team not found" };
    }

    const user = self.realm.currentUser;
    const newUsers = team.users.filter((u) => u !== user.id);

    try {
      const updateResult = await collection.updateOne(
        { code: { $eq: code } },
        { $set: { users: newUsers } }
      );
    } catch (e) {
      console.log(e);
      return { success: false, message: "Couldn't update the team" };
    }

    return { success: true };
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

    return responses;
  };

  /**
   * Get the number of minutes exercised by the team members for the given
   * day
   */
  self.getTeamMinutes = async function (team, day) {
    const allTeamData = await self.realm.currentUser.functions.getTeamData(
      new ObjectId(team._id)
    );
    const allResponses = allTeamData[0].allresponses;
    const teamMinutes = [];

    for (const userId of team.users) {
      // Get the user's responses for the given day

      const userResponses = allResponses.filter((r) => r.user === userId);

      // allResponses.filter returns an array. If it's empty then there are no
      // responses to look at for this user
      if (userResponses.length > 0) {
        const todaysResponses = userResponses[0].responses.filter(
          (r) => r.day === day
        );
        // Add the minutes to the total
        let userMinutes = 0;
        for (const r of todaysResponses) {
          userMinutes += parseInt(r.minutes, 10) || 0;
        }
        teamMinutes.push(userMinutes);
      } else {
        teamMinutes.push(0);
      }
    }

    return teamMinutes;
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

  self.getUserProfile = async function (id) {
    const db = getDb();
    const collection = db.collection("usersDetails");

    if (!id) {
      id = self.realm.currentUser.id;
    }

    const user = await collection.findOne({
      _userid: { $eq: id },
    });

    if (user) {
      return self.tidy(user);
    }

    return null;
  };

  /**
   * Create a user profile
   */
  self.updateUserProfile = async function (userProfile) {
    const db = getDb();
    const collection = db.collection("usersDetails");
    const newUserProfile = {
      _userid: self.realm.currentUser.id,
      modules: {}, // added so that modules is always created, especially on profile creation
      ...userProfile,
    };

    delete newUserProfile._id; // delete ._id because realm complained

    try {
      await collection.updateOne(
        {
          _userid: { $eq: self.realm.currentUser.id },
        },
        newUserProfile,
        { upsert: true }
      );
    } catch (e) {
      console.error("Haven't been able to update user profile", e);
      return {
        success: false,
        message: "Sorry, we couldn't update your user profile",
      };
    }

    return {
      success: true,
      message: "User profile updated",
      userProfile: newUserProfile,
    };
  };

  /**
   * Progress a user along their module
   */

  self.progressUserAlongModule = async function (moduleId) {
    const db = getDb();
    const moduleCollection = db.collection("modules");
    const userCollection = db.collection("usersDetails");
    const userProfile = await this.getUserProfile(self.realm.currentUser.id);

    if (!userProfile) {
      console.error("Unable to find user to progress them along a module");
      return {
        success: false,
        message: "user profile doesn't exist",
      };
    }

    let moduleObjectId;
    try {
      moduleObjectId = new ObjectId(moduleId);
    } catch (e) {
      console.warn("problem when converting moduleId", e);
      moduleObjectId = moduleId;
    }

    const module = await moduleCollection.findOne({
      _id: { $eq: moduleObjectId },
    });

    if (!module) {
      return {
        success: false,
        message: "module doesn't exist",
      };
    }

    const numPlaylists = module.playlists.length;
    const stage = userProfile.modules[moduleId].stage;
    const newStage = stage >= numPlaylists ? stage : stage + 1;
    const updated = {
      ...userProfile.modules,
    };

    updated[moduleId].stage = newStage;

    try {
      await userCollection.updateOne(
        {
          _userid: { $eq: self.realm.currentUser.id },
        },
        {
          $set: {
            modules: updated,
          },
        }
      );
    } catch (e) {
      console.error("Error updating user", e);
      return {
        success: false,
        message: "Sorry, we couldn't update your progress",
      };
    }
  };

  /**
   * Get the userProfile for all the users in a team
   */

  self.getTeamUserProfiles = async function (teamCode) {
    const db = getDb();
    const collection = db.collection("teams");
    const team = await collection.findOne({ code: { $eq: teamCode } });

    const users = [];
    for (const id of team.users) {
      let user = await self.getUserProfile(id);

      if (user === null) {
        // this happens when someone joins a team, but closes the app before creating their profile
        user = { prefName: "Unknown" };
      }

      users.push(user);
    }

    return users;
  };

  /**
   * Tidy up a result so it's safe to pass into redux with warnings about non-serializabilty
   *
   */
  self.tidy = function (result, depth) {
    if (typeof depth == "undefined") {
      depth = 0;
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
