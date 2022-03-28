/**
 * Controllers link the client up with the redux model
 * for common operations
 *
 * use the addControllersProp() to wrap components that need to call controllers,
 * it adds the available controllers as a prop
 */

import React, { useContext } from "react";

import {
  CLEAR_TEAMS,
  SET_TEAMS,
  START_GET_TEAM_RESPONSES,
  SET_TEAM_RESPONSES,
  START_JOIN_TEAM,
  CLEAR_JOIN_TEAM,
  ABORT_JOIN_TEAM,
  START_CREATE_TEAM,
  CLEAR_CREATE_TEAM,
  ABORT_CREATE_TEAM,
} from "./slices/Teams";

import { CLEAR_EXPERIMENTS, SET_EXPERIMENTS } from "./slices/Experiments";

import { CLEAR_FEED, SET_FEED } from "./slices/Feed";

import { CLEAR_MODULES, GET_MODULES } from "./slices/Modules";

import { CLEAR_USER, SET_USER } from "./slices/Users";


/**
 * These controller functions will be returned by getControllers
 * - they'll be wrapped so that client, store and controllers are provided
 */

 async function SET_USER_PROFILE(client, store, controllers) {

  store.dispatch(CLEAR_USER());

  let userProfile = null;
  try {
    userProfile = await client.getUserProfile();
  } catch (error) {
    return console.error(error);
  }

  store.dispatch(SET_USER({ userProfile }));
  console.log("SET_USER", userProfile);
}

async function SET_USER_PROFILE_IF_REQD(client, store, controllers) {
  const state = store.getState();
  const fetching = state.userProfile.fetching;
  const loaded = state.userProfile.loaded;
  if (!fetching && !loaded) {
    console.log("Refresh of user profile is required (fetching loading)", fetching, loaded);
    return await controllers.SET_USER_PROFILE();
  } else {
    console.log("Refresh of user profile is not required (fetching loading)", fetching, loaded);
  }
}

 async function UPDATE_USER_PROFILE(client, store, controllers, profile) {

  console.log("CREATE_USER_PROFILE", profile);
  let res = await client.createUserProfile(profile);

  if (res.success === false) {
    return false;
  }

  controllers.SET_USER_PROFILE();
  return true;
}

async function LOAD_MODULES(client, store) {

  store.dispatch(CLEAR_MODULES());

  let modules = null;
  try {
    modules = await client.getModules();
  }
  catch (error) {
    return console.error(error);
  }

  store.dispatch(GET_MODULES({ modules }));
  console.log("SET_MODULES", modules);
}

async function LOAD_MODULES_IF_REQD(client, store, controllers) {
  const state = store.getState();
  const f = state.modules.fetching;
  const l = state.modules.loaded;
  if (!f && !l) {
    console.log("Refresh of modules is required", f, l);
    return await controllers.LOAD_MODULES();
  } else {
    console.log("Refresh or modules is not required", f, l);
  }
}


async function UPDATE_USER_MODULE(client, store, controllers, user, module, subscribe) {
  const userModules = user.modules || {};
  const modules = { ...userModules };

  if (subscribe) {
    modules[module._id] = {
      id: module._id,
      name: module.name,
      topic: module.topic,
      stage: 0,
      active: true
    }
  } else {
    modules[module._id] = {
      ...userModules[module._id],
      active: false
    }
  }

  const newUser = {
    ...user,
    modules: modules
  }

  await controllers.UPDATE_USER_PROFILE(newUser);
  await controllers.SET_USER_PROFILE();
}


/**
 * Subscribe a user to their path's module and unsubscribe from the others
 */

async function SET_MODULE_FOR_PATH(client, store, controllers, newPath, oldPath) {
  const allModules = store.getState().modules.modules;
  const userProfile = store.getState().userProfile.userProfile;

  // Unsubscribe the user from their old path module if they were subscribed
  if (oldPath !== newPath) {
    const oldPathModuleTopic = oldPath + "-path"
    const oldPathModule = allModules.find(m => m.topic === oldPathModuleTopic);
    if (!oldPathModule) {
      console.error("No module found for path", oldPath, "with tag", oldPathModule);
    } else {
      await controllers.UPDATE_USER_MODULE(userProfile, oldPathModule, false);
    }
  }

  // Subscribe the user to their new path module
  const pathModuleTopic = newPath + "-path"
  const pathModule = allModules.find(m => m.topic === pathModuleTopic);
  if (!pathModule) {
    return console.error("No module found for path", newPath, "with tag", pathModuleTopic);
  }

  await controllers.UPDATE_USER_MODULE(userProfile, pathModule, true);
}

async function LOAD_TEAMS(client, store) {

  // Clear the current teams and set the fetching flag

  store.dispatch(CLEAR_TEAMS());

  // Get the teams and pop them into the store

  let teams;
  try {
    teams = await client.getTeams();
  }
  catch (error) {
    return console.error(error);
  }

  store.dispatch(SET_TEAMS({ teams }));
  console.log('SET_TEAMS', teams, teams.bybox);
}

/**
 * Load teams if they don't seem to be loaded already
 */
function LOAD_TEAMS_IF_REQD(client, store, controllers) {
  var state = store.getState();

  var f = state.teams.fetching;
  var l = state.teams.loaded;
  if (!f && !l) {
    console.log("Refresh is required", f, l);
    return controllers.LOAD_TEAMS();
  } else {
    console.log("Refresh is not required", f, l);
  }
}

async function JOIN_TEAM(client, store, controllers, code) {
  store.dispatch(START_JOIN_TEAM());
  var res = await client.joinTeam(code);

  if (res.success === false) {
    store.dispatch(ABORT_JOIN_TEAM(res.message));
    return false;
  } else {
    store.dispatch(CLEAR_JOIN_TEAM());
    controllers.LOAD_TEAMS();
    return true;
  }
}

async function CREATE_TEAM(client, store, controllers, name, desc, expid, startDate, parentTeam) {

  // Start date defaults to today
  // if(typeof startDate == 'undefined'){
  //   startDate = (new Date()).toISOString().substring(0,10);

  store.dispatch(START_CREATE_TEAM());
  var res = await client.createTeam(name, desc, expid, startDate, parentTeam);

  if (res.success === false) {
    store.dispatch(ABORT_CREATE_TEAM(res.message));
    return false;
  } else {
    store.dispatch(CLEAR_CREATE_TEAM());
    controllers.LOAD_TEAMS();
    return true;
  }
}

async function PROGRESS_ALONG_MODULE(client, store, controllers, moduleId) {
  const ret = await client.progressUserModule(moduleId);
  await controllers.SET_USER_PROFILE();
}

async function ADD_RESPONSE(client, store, controllers, expid, value) {
  if(!value.submitted) {
    value.submitted = new Date().toISOString();
  }
  client.addResponse(expid, value);

  await controllers.LOAD_TEAMS(); // Refresh team info, since that includes responses
}

function LOAD_EXPERIMENTS(client, store, controllers) {
  store.dispatch(CLEAR_EXPERIMENTS());
  client.getExperiments().then(
    (exps) => {
      store.dispatch(SET_EXPERIMENTS({ exps }));
    },
    (err) => {
      console.error(err);
    }
  );
}

async function GET_TEAM_RESPONSES(client, store, controllers, teamid) {
  store.dispatch(START_GET_TEAM_RESPONSES({ team: teamid }));

  try {
    var r = await client.getTeamResponses(teamid);
    store.dispatch(SET_TEAM_RESPONSES({ team: teamid, responses: r }));
  } catch (e) {
    SET_TEAM_RESPONSES({ team: teamid, responses: {} });
  }
}

/**
 * Refresh the content feed
 */
let Parser = require("rss-parser");
let parser = new Parser();

async function GET_FEED(client, store, controllers) {
  store.dispatch(CLEAR_FEED());

  const feed = await parser.parseURL(
    "https://svm00146.ecs.soton.ac.uk/xb/feed.rss"
  );

  var n = 0;
  var time = Date.now();
  feed.items.forEach((item) => {
    item.type = "news"; // RSS items are 'news' posts
    item.id = "rss-" + time + "-" + n++;
    item.date = item.date ? Date.parse(item.date).getTime() : time;
  });

  // Get team responses

  await LOAD_TEAMS_IF_REQD(client, store, controllers);

  const state = store.getState();

  const teams = state.teams.teams;
  const promises = teams.map((team) => GET_TEAM_RESPONSES(client, store, controllers, team._id));
  await Promise.all(promises);

  // Team info is disabled for now
  const enhancedTeams = []; // store.getState().teams.teams;

  // Process feed

  const feeds = [...feed.items];

  for (const team of enhancedTeams) {

    // Ignore single-membered team

    if (team.users.length < 2) {
      continue;
    }

    const teamResponses = team.responses.all;

    if (!teamResponses) {
      continue;
    }

    const updates = {};

    for (const memberResponses of teamResponses) {
      for (const response of memberResponses.responses) {
        if (response.type !== 'strength' && response.type !== 'questionnaire' && response.type !== 'questionnaire-evening') {
          continue;
        }

        const date = new Date(response.submitted);
        date.setHours(0, 0, 0, 0);                    // Round to the nearest date

        const timestamp = date.getTime();

        let entry = updates[timestamp];

        if (!entry) {
          entry = {
            exercised: { set: new Set(), hasOwn: false },
            answered: { set: new Set(), hasOwn: false },
          };

          updates[timestamp] = entry;
        }

        let type;

        if (response.type === 'strength') {
          type = entry.exercised;
        }

        if (response.type === 'questionnaire' || response.type === 'questionnaire-evening') {
          type = entry.answered;
        }

        type.hasOwn = team.responses.own ? team.responses.own.user === memberResponses.user : false;
        type.set.add(memberResponses.user);
      }
    }

    // Sort updates chronologically

    const entries = Object.entries(updates).sort((entry1, entry2) => entry1[0] - entry2[0]);

    for (const [timestamp, entry] of entries) {

      const baseFeed = {
        type: 'team_update',
        team: team.name,
        date: Number(timestamp),
      };

      feeds.unshift({
        ...baseFeed,
        update: {
          count: entry.exercised.set.size,
          hasOwn: entry.exercised.hasOwn,
          display: 'strength exercises',
        },
      });

      feeds.unshift({
        ...baseFeed,
        update: {
          count: entry.answered.set.size,
          hasOwn: entry.answered.hasOwn,
          display: 'questionnaire',
        },
      });
    }
  }

  store.dispatch(SET_FEED(feeds));
}

function getControllers(store, client) {
  var out = { client: client, store: store };

  var controllers = {
    LOAD_TEAMS,
    LOAD_TEAMS_IF_REQD,
    GET_TEAM_RESPONSES,
    LOAD_EXPERIMENTS,
    JOIN_TEAM,
    CREATE_TEAM,
    ADD_RESPONSE,
    GET_FEED,
    LOAD_MODULES,
    LOAD_MODULES_IF_REQD,
    SET_USER_PROFILE,
    SET_USER_PROFILE_IF_REQD,
    UPDATE_USER_PROFILE,
    PROGRESS_ALONG_MODULE,
    SET_MODULE_FOR_PATH,
    UPDATE_USER_MODULE
  };

  for (var n of Object.keys(controllers)) {
    var f = controllers[n];
    out[n] = (function (f, n) {
      return function (...args) {
        // Trap f and n in a closure so they don't change
        console.log("Call controller", n, f, args);
        return f(client, store, out, ...args);
      };
    })(f, n);
  }

  return out;
}

/**
 * A Higher Order Component that provides a controllers prop contianing
 * the controllers from the curent context
 */
function addControllersProp(Component) {
  return function (props) {
    var controllers = useContext(ControllerContext);
    return <Component controllers={controllers} {...props} />;
  };
}

const ControllerContext = React.createContext(false);

export default ControllerContext;
export { getControllers, addControllersProp };
