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

export {
  preparePlaylist,
  updateUserProfileModules,
  translateMoveTypes,
  getActiveModules,
};
