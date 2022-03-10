/**
* This is the experiment-specific code for the Spring 2022 Strength in Work Experiment
*/

import { FlashOnRounded } from "@material-ui/icons";

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

  // var required = []; // Mandatory tasks -- break up into intro, module and exit tasks

  let progressTasks = [];  // go into the progress page task list
  let introTasks = [];     // intro tasks to go onto the playlist
  let moduleTasks = [];    // task modules tasks to go onto the playlist
  let exitTasks = [];      // exit tasks to go onto the playlist
  var otherTasks = []; // Other tasks that can be done, but optionally, i.e. experiments

  team.s22plan = false;

  // Planning for s22 is done in advance. The plan response will look something like
  // var examplePlan = {
  //   // Week 1 only has a daily target
  //   effectiveWeek: 1, // The effective week of the study for the participant; might not be the real week!
  //   target: 14
  // }
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

  let modulesObj = toModuleObj(modules);  // convert to Obj to index by module name

  // No plan? Require the planning task to be completed
  if(!team.s22plan) {

    if(!team.s22path) {
      progressTasks.push({
        path: "choose-path",
        intype: "s22path",
        desc: "You need to choose a path",
        verb: "CHOOSE",
        s22onPath: false,
        onPlaylist: false,
      });
    }
    else
    {
      otherTasks.push({
        path: "change-path",
        intype: "s22path",
        desc: "You can change your path",
        verb: "CHANGE",
        s22onPath: false,
        onPlaylist: false,
      });

      progressTasks.push({
        type: "plan-minutes",
        intype: "s22plan",
        desc: "You need to plan your week",
        verb: "PLAN",
        s22onPath: false,
        onPlaylist: false,
      });
    }

  } else {

    // Otherwise generate the daily tasks

    otherTasks.push({ // An optional re-planning task
      "type": "change-minutes",
      intype: 's22plan',
      desc: 'You can change your weekly plan',
      verb: 'CHANGE',
      s22onPath: false,
      onPlaylist: false,
    });

    otherTasks.push({
      type: "change-path",
      intype: 's22path',
      desc: 'You can change your path',
      verb: 'CHANGE',
      s22onPath: false,
      onPlaylist: false,
    });

    console.log("Generating s22 tasks with modules", modules);

    let theseTasks;
    const expDayIndex = expDay - 1;  // because the array of tasks on mongodb are zero indexed

    // TODO: I think there is something funky with the [0]'s here

    // switch (dayOfWeek) {
    //   case 1: // PREP tasks
    //     theseTasks = modulesObj.Prep.tasks[expDayIndex][0];
    //     console.log("Prep tasks for experiment day " + expDay, theseTasks);
    //     for (let i = 0; i < theseTasks.length; i++) {
    //       moduleTasks.push(theseTasks[i]);
    //     }
    //     break;
    //   case 2:  // ENDURANCE tasks
    //   case 4:
    //     theseTasks = modulesObj.Endurance.tasks[expDayIndex][0];
    //     console.log("Endurance tasks for experiment day " + expDay, theseTasks);
    //     for (let i = 0; i < theseTasks.length; i++) {
    //       moduleTasks.push(theseTasks[i]);
    //     }
    //     break;
    //   case 3: // STRENGTH tasks
    //   case 5:
    //     theseTasks = modulesObj.Strength.tasks[expDayIndex][0];
    //     console.log("Strength tasks for experiment day " + expDay, theseTasks);
    //     for (let i = 0; i < theseTasks.length; i++) {
    //       moduleTasks.push(theseTasks[i]);
    //     }
    //     break;
    //   default:
    //     console.error("unexpected day of week when adding module tasks", dayOfWeek);
    //     break;
    // }

    console.log("Generated module tasks", moduleTasks);
  }

  moduleTasks.push({
    type: "test-quiz",
    intype: "quiz",
    desc: "Test Quiz",
    verb: "ANSWER",
    onPlaylist: true,
    timed: false,
    s22onPath: "all",
    question: "What is the answer to life, the universe, and everything?",
    answers: [
      "42",
      "Eating chocolate",
      "Sandwich",
      "I don't know",
      "Completing this quiz"
    ],
    correctAnswer: 0,
    explanation: "The answer is 42 because of book",
  });

  // Intro tasks, why will always be here

  introTasks.push({
    type: "intro-questions",
    intype: "questionnaire",
    desc: "TEST TEST How is it going?",
    verb: "ANSWER",
    onPlaylist: true,
    timed: false,
    s22onPath: "all",
  });

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

  // if(dayOfWeek === 5)
  // {
  //   exitTasks.push({
  //     type: "exit-questions-end-week",
  //     intype: "questionnaire-endWeek",
  //     desc: "How was your week?",
  //     verb: "ANSWER",
  //     onPlaylist: true,
  //     timed: false,
  //     s22onPath: "all",
  //   })
  // }
  // else {
  //   exitTasks.push({
  //     type: "exit-questions",
  //     intype: "questionnaire-evening",
  //     desc: "How are you feeling today?",
  //     verb: "ANSWER",
  //     onPlaylist: true,
  //     timed: false,
  //     s22onPath: "all"
  //   });
  // }


  // TODO: test quizzes are hard coded for now

  exitTasks.push({
    type: "exit-questions-end-week",
    intype: "questionnaire-endWeek",
    desc: "TEST TEST How was your week?",
    verb: "ANSWER",
    onPlaylist: true,
    timed: false,
    s22onPath: "all",
  })

  exitTasks.push({
    type: "exit-questions",
    intype: "questionnaire-evening",
    desc: "TEST TEST How are you feeling today?",
    verb: "ANSWER",
    onPlaylist: true,
    timed: false,
    s22onPath: "all"
  });

  // Other movement -- "do your own thing" -- is always here and optional
  // for builders -- what about other paths?

  otherTasks.push({
    type: "other-movement",
    intype: "s22other",
    desc: "Do your own thing",
    verb: "ADD",
    onPlaylist: true,
    timed: true,
    s22onPath: "all",
  });

  // TODO: I don't think splitting these tasks up is going to work
  const requiredTasksObj = {progressTasks: progressTasks, introTasks: introTasks, moduleTasks: moduleTasks, exitTasks: exitTasks};
  team.experiment.tasks[expDay] = { required: requiredTasksObj, optional: otherTasks };

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