/**
* This is the experiment-specific code for the Spring 2022 Strength in Work Experiment
*/

/**
* The experiment is passed the team record that it represents.
* The team record will have experiment information attached; but may be
* incomplete when passed in, as it's still in the process of being assembled.
* The experiment function should annotate the object with additional information.
*
* If there are sub-experiments, they will be populated.
*/
const decorateTeam = (team) => {

  for (var eday = 1; eday <= team.experiment.day; eday++) {

    var week = Math.floor(eday / 7);

    // console.log("Add tasks for day/week ", eday, week, " of ", team.experiment.day)

    var qreq = [];
    // Other tasks that can be done, but optionally
    var others = [];

    //TODO: Need to set tasks based on the users weekly plan

    if (week >= 1) {
      qreq.push({
        type: "strength-setter",
        desc: "Set your current Strength Exercise",
        verb: "DO IT",
      });
    }

    if (week >= 1) {
      // Strength exercise only on week days
      var dow = eday % 7;
      if (dow == 0 || dow == 6) { //if it's weekend, movement is optional
        others.push({
          type: "moveminutes",
          desc: "Do your Daily Exercise",
          verb: "DO IT",
        });
      } else {
        qreq.push({
          type: "moveminutes",
          desc: "Do your Daily Exercise",
          verb: "DO IT",
        });
      }
    }


    team.experiment.tasks[eday] = { required: qreq, optional: others };
  } // End day loop
}

export default { decorateTeam };
