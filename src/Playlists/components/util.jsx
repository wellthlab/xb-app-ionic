import {
  barbellOutline,
  newspaperOutline,
  schoolOutline,
  videocamOutline,
  stopwatchOutline,
  flaskOutline,
  informationCircleOutline,
  trailSignOutline,
  journalOutline,
} from "ionicons/icons";

/**
 * Prepare a playlist for display:
 *  - add s22questions task if one doesn't exist
 */
function preparePlaylist(playlist) {
  const modifiedPlaylist = [
    ...playlist.filter((task) => Object.keys(task).length !== 0),
  ];

  // check if there is a s22questions task and add one if there isn't
  const count = modifiedPlaylist.filter(
    (task) => task.intype === "s22questions"
  ).length;

  if (count === 0) {
    modifiedPlaylist.push({
      desc: "Movement Questions",
      intype: "s22questions",
      verb: "ANSWER",
    });
  }

  return modifiedPlaylist;
}

/**
 * Update the user profile with modules which have been subbed or unsubbed
 *
 * @param  oldProfile - the userProfile before update
 * @param  newModules - the updated user module object
 * @param  updateUser - the function to update the user profile in the DB
 */
async function updateUserProfileModules(oldProfile, newModules, updateUser) {
  let user = {
    ...oldProfile,
    modules: newModules,
  };
  await updateUser(user);
}

/**
 *
 * @param moves
 * @returns {string[]|*}
 */
function translateMoveTypes(moves) {
  switch (moves) {
    case "push":
    case "lower push":
    case "upper push":
      return ["upper push", "lower push"];
    case "pull":
    case "lower pull":
    case "upper pull":
      return ["upper pull", "lower pull"];
    case "unilateral lower push":
    case "bilateral lower push":
      return ["unilateral upper push", "unilateral lower push"];
    case "unilateral lower pull":
    case "bilateral lower pull":
      return ["unilateral upper pull", "unilateral lower pull"];
    default:
      return moves;
  }
}

/**
 *
 * @param userModules
 * @returns {string[]|*}
 */
function getActiveModules(userModules) {
  const activeModules = [];
  // TODO: this is not scalable, and should be refactored
  for (const moduleObj of Object.values(userModules)) {
    // this is over modules in a topic
    // do not include snacks, as there are no progression for snacks
    if (moduleObj.active && !moduleObj.topic.includes("snack/")) {
      activeModules.push(moduleObj);
    }
  }

  return activeModules;
}

function prepareTask(tasks, currentTaskIdx, module) {
  const task = { ...tasks[currentTaskIdx] };

  // We need more useful data for the EDT set... this is a mess lol
  if (task.intype === "s22edtset") {
    task.instructions =
      "Try to fit in as many sets in the 7-minute limit. When ready, TAP on " +
      "the move you want to start with. TAP the OTHER move when you have " +
      "completed 5 REPS to add a SET. When the time runs out, add any " +
      "outstanding reps.";
    const edtTasks = tasks.filter((task) => task.intype === "s22edtset");

    // determine which EDT block this is, by counting how many EDT sets before
    // this one
    const tasksBeforeThisOne = tasks.slice(0, currentTaskIdx);
    task.edtBlock = tasksBeforeThisOne.filter(
      (e) => e.intype === "s22edtset"
    ).length;

    // Add all the moveTypes for all the EDT tasks, used for movement picking
    const moveTypes = [];
    edtTasks.forEach((task, index, arr) => {
      moveTypes.push(translateMoveTypes(task.edtMoves));
    });

    task.moveTypes = moveTypes;
  }

  // Add these as fields to the task as well, so we can save and pass info
  // about the module
  task.moduleId = module._id;
  task.module = module;
  task.type = task.type || `task-${currentTaskIdx}-${task.intype}`;

  return task;
}

/**
 * TODO: add more thumbnails for topics
 * Get the thumbnail URL for a given topic
 * @param topic - the topic
 *
 */
function getTopicThumbnail(topic) {
  switch (topic) {
    default:
      return "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y";
  }
}

/**
 *
 * @param verb
 * @returns {string}
 */
function getTaskIcon(verb) {
  switch (verb) {
    case "LEARN":
      return schoolOutline;
    case "MOVE":
      return barbellOutline;
    case "ANSWER":
      return newspaperOutline;
    case "WATCH":
      return videocamOutline;
    case "MEASURE":
      return stopwatchOutline;
    case "EXPERIMENT":
      return flaskOutline;
    case "FOLLOW":
      return trailSignOutline;
    case "JOURNAL":
      return journalOutline;
    default:
      return informationCircleOutline;
  }
}

export {
  preparePlaylist,
  updateUserProfileModules,
  translateMoveTypes,
  getActiveModules,
  prepareTask,
  getTopicThumbnail,
  getTaskIcon,
};
