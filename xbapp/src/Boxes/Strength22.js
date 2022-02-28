/**
* This is the experiment-specific code for the Spring 2022 Strength in Work Experiment
*/

import { QueuePlayNextSharp, TramRounded } from "@material-ui/icons";
import { qrCodeSharp } from "ionicons/icons";
import { GiConsoleController } from "react-icons/gi";

import {IonRow, IonCol} from "@ionic/react";

/**
* The experiment is passed the team record that it represents.
* The team record will have experiment information attached; but may be
* incomplete when passed in, as it's still in the process of being assembled.
* The experiment function should annotate the object with additional information.
*
* If there are sub-experiments, they will be populated.
*/
const decorateTeam = (team) => {
  var eday = team.experiment.day;
  var week = Math.floor(eday / 7);

  team.isStrength22 = true;
  team.s22path = false;

  if(typeof team.lastEntryByType.s22path !== 'undefined') {
    team.s22path = team.lastEntryByType.s22path;
  }

  var required = []; // Mandatory tasks
  var others = []; // Other tasks that can be done, but optionally

  team.s22plan = false;

  // Planning for s22 is done in advance. The plan response will look something like
  var examplePlan = {
    // Week 1 only has a daily target
    effectiveWeek: 1, // The effective week of the study for the participant; might not be the real week!
    target: 14
  }
  // End of EXAMPLE plan

  // Create a handy reference to TODAYS plan
  var dow = (new Date()).getDay();

  // Try to find a s22 plan
  if(typeof team.lastEntryByType.s22plan !== 'undefined') {

    var plan = team.lastEntryByType.s22plan;

    // Check that the plan is for the current week
    var planweek = Math.floor(plan.day / 7);
    if(planweek === week) { // week is calculated above, from the experiment day
      team.s22plan = team.lastEntryByType.s22plan;
      console.log("Found a current s22 plan");
    } else {
      console.log("s22 plan is out of date", "Current week: ", week, "Plan week:", planweek);
    }
  } else {
    console.log("No s22 plan has ever been saved");
  }

  // No plan? Require the planning task to be completed
  if(!team.s22plan) {

    if(!team.s22path) {
      required.push({
        intype: "s22path",
        desc: "You need to choose a path",
        verb: "CHOOSE",
        s22onPath: false,
      });
    }
    else
    {
      others.push({
        intype: "s22path",
        desc: "You can change your path",
        verb: "CHANGE",
        s22onPath: false,
      });

      required.push({
        intype: "s22plan",
        desc: "You need to plan your week",
        verb: "PLAN",
        s22onPath: false,
      });
    }

  } else {
  // Otherwise generate the daily tasks

    others.push({ // An optional re-planning task
      intype: 's22plan',
      desc: 'You can change your weekly plan',
      verb: 'PLAN',
      s22onPath: false,
    });

    others.push({
      intype: 's22path',
      desc: 'You can change your path',
      verb: 'CHANGE',
      s22onPath: false,
    });

    const tasks = require("../Tasks/tasks.json");
    required = tasks[team.s22plan.day];
  }

  others.push({
    type: "other-movement",
    intype: "s22other",
    desc: "Do your own thing!",
    verb: "ADD",
    timed: true,
    s22onPath: "all",
  });

  console.log("others", others);

  team.experiment.tasks[eday] = { required: required, optional: others };

  // Add today's minutes total
  team.myMinutesToday = 0;
  team.myTargetToday = false;

  if(team.s22plan.plan) {
    team.myTargetToday = team.s22plan.plan.target;
  }

  team.responses.own.responses.map((res) => {
    if(res.day === eday && res.minutes) {
      team.myMinutesToday += res.minutes;
    }
  })
}

export default { decorateTeam };
