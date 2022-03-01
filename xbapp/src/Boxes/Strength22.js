/**
* This is the experiment-specific code for the Spring 2022 Strength in Work Experiment
*/

function toModuleObj(moduleArr) {
  let obj = {};
  for(let i = 0; i < moduleArr.length; i++) {
    obj[moduleArr[i].name] = moduleArr[i];
  }

  return obj;
}

/**
* The experiment is passed the team record that it represents.
* The team record will have experiment information attached; but may be
* incomplete when passed in, as it's still in the process of being assembled.
* The experiment function should annotate the object with additional information.
*
* If there are sub-experiments, they will be populated.
*/
const decorateTeam = (team, modules) => {
  var expDay = team.experiment.day;
  var expWeek = Math.floor(expDay / 7);

  team.isStrength22 = true;
  team.s22path = false;

  if(typeof team.lastEntryByType.s22path !== 'undefined') {
    team.s22path = team.lastEntryByType.s22path;
  }

  var required = []; // Mandatory tasks -- break up into intro, module and exit tasks
  var others = []; // Other tasks that can be done, but optionally

  let introTasks = [];
  let moduleTasks = [];
  let exitTasks = [];

  team.s22plan = false;

  // Planning for s22 is done in advance. The plan response will look something like
  var examplePlan = {
    // Week 1 only has a daily target
    effectiveWeek: 1, // The effective week of the study for the participant; might not be the real week!
    target: 14
  }
  // End of EXAMPLE plan

  // Create a handy reference to TODAYS plan
  var dayOfWeek = (new Date()).getDay();

  // Try to find a s22 plan
  if(typeof team.lastEntryByType.s22plan !== 'undefined') {
    var plan = team.lastEntryByType.s22plan;
    // Check that the plan is for the current week
    var planweek = Math.floor(plan.day / 7);
    if(planweek === expWeek) { // week is calculated above, from the experiment day
      team.s22plan = team.lastEntryByType.s22plan;
      console.log("Found a current s22 plan");
    } else {
      console.log("s22 plan is out of date", "Current week: ", expWeek, "Plan week:", planweek);
    }
  } else {
    console.log("No s22 plan has ever been saved");
  }

  // TODO: should this be moved elsewhere?
  let modulesObj = toModuleObj(modules);  // convert to Obj for better indexing

  // No plan? Require the planning task to be completed
  if(!team.s22plan) {

    if(!team.s22path) {
      introTasks.push({
        intype: "s22path",
        desc: "You need to choose a path",
        verb: "CHOOSE",
        s22onPath: false,
        onPlaylist: false,
      });
    }
    else
    {
      others.push({
        intype: "s22path",
        desc: "You can change your path",
        verb: "CHANGE",
        s22onPath: false,
        onPlaylist: false,
      });

      introTasks.push({
        intype: "s22plan",
        desc: "You need to plan your week",
        verb: "PLAN",
        s22onPath: false,
        onPlaylist: false,
      });
    }

  } else {
  // Otherwise generate the daily tasks

    introTasks.push({ // An optional re-planning task
      intype: 's22plan',
      desc: 'You can change your weekly plan',
      verb: 'PLAN',
      s22onPath: false,
      onPlaylist: false,
    });

    introTasks.push({
      intype: 's22path',
      desc: 'You can change your path',
      verb: 'CHANGE',
      s22onPath: false,
      onPlaylist: false,
    });

    console.log("Generating s22 tasks with modules", modules);

    // TODO: used for debug
    dayOfWeek = 1;
    expDay = 0;

    // TODO: I think there is something funky with the [0]'s here

    let theseTasks;
    switch (dayOfWeek) {
      case 1: // PREP tasks
        theseTasks = modulesObj.Prep.tasks[expDay][0];
        console.log("Prep tasks for experiment day " + expDay, theseTasks);
        for (let i = 0; i < theseTasks.length; i++) {
          moduleTasks.push(theseTasks[i]);
        }
        break;
      case 2:  // ENDURANCE tasks
      case 4:
        console.log("Endurance tasks for experiment day " + expDay, theseTasks);
        theseTasks = modulesObj.Endurance.tasks[expDay][0];
        for (let i = 0; i < theseTasks.length; i++) {
          moduleTasks.push(theseTasks[i]);
        }
        break;
      case 3: // STRENGTH tasks
      case 5:
        theseTasks = modulesObj.Strength.tasks[expDay][0];
        console.log("Strength tasks for experiment day " + expDay, theseTasks);
        for (let i = 0; i < theseTasks.length; i++) {
          console.log("Adding task", theseTasks[i]);
          moduleTasks.push(theseTasks[i]);
        }
        break;
      default:
        console.error("unexpected day of week when adding module tasks", dayOfWeek);
        break;
    }

    console.log("Generated module tasks", moduleTasks);
  }

  // Exit tasks, which are always the same. These are questions to ask at the
  // end of the day.

  exitTasks.push({
    type: "movement-questions",
    intype: "s22questions",
    desc: "How did you move today?",
    verb: "ANSWER",
    onPlaylist: true,
    timed: false,
    s22onPath: "all"
  });

  if(dayOfWeek === 5)
  {
    exitTasks.push({
      type: "exit-questions-end-week",
      intype: "questionnaire-endWeek",
      desc: "How was your week?",
      verb: "ANSWER",
      onPlaylist: true,
      timed: false,
      s22onPath: "all",
    })
  }
  else {
    exitTasks.push({
      type: "exit-questions",
      intype: "questionnaire-evening",
      desc: "How are you feeling today?",
      verb: "ANSWER",
      onPlaylist: true,
      timed: false,
      s22onPath: "all"
    });
  }

  // Other movement "do your own thing" is always here

  others.push({
    type: "other-movement",
    intype: "s22other",
    desc: "Do your own thing",
    verb: "ADD",
    onPlaylist: true,
    timed: true,
    s22onPath: "all",
  });

  // TODO: I don't think splitting these tasks up is going to work
  let requiredObj = {introTasks: introTasks, moduleTasks: moduleTasks, exitTasks: exitTasks};
  team.experiment.tasks[expDay] = { required: requiredObj, optional: others };

  // Add today's minutes total
  team.myMinutesToday = 0;
  team.myTargetToday = false;

  if(team.s22plan.plan) {
    team.myTargetToday = team.s22plan.plan.target;
  }

  team.responses.own.responses.map((res) => {
    if(res.day === expDay && res.minutes) {
      team.myMinutesToday += res.minutes;
    }
  })
}

export default { decorateTeam };