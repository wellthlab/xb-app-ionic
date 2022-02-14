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

  var eday = team.experiment.day;

    var week = Math.floor(eday / 7);

    // console.log("Add tasks for day/week ", eday, week, " of ", team.experiment.day)

    team.isStrength22 = true;
    team.s22path = false;

    if(typeof team.lastEntryByType.s22path !== 'undefined') {
      team.s22path = team.lastEntryByType.s22path;
    }


    var qreq = []; // Mandatory tasks
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
      if(planweek == week) { // week is calculated above, from the experiment day
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
        qreq.push({
          type: 's22path',
          desc: 'You need to choose a path',
          verb: 'CHOOSE'
        });
      }
      else
      {
        others.push({
          type: 's22path',
          desc: 'You can change your path',
          verb: 'CHANGE'
        });

        qreq.push({
          type: 's22plan',
          desc: 'You need to plan your week',
          verb: 'PLAN'
        });
      }

    } else {
    // Otherwise generate the daily tasks

      others.push({ // An optional re-planning task
        type: 's22plan',
        desc: 'You can change your weekly plan',
        verb: 'PLAN'
      });

      others.push({
        type: 's22path',
        desc: 'You can change your path',
        verb: 'CHANGE'
      });


      // Set up other tasks according to week number
      var effWeek = team.s22plan.plan.effectiveWeek;

      console.log("effectiveWeek", effWeek);

      if(effWeek == 1) {
        switch(dow) {

          case 1:

              qreq.push({
                type: 's22assessedvideo',
                desc: "Try a plank",
                verb: "TRY",
                move: 'plank',
                timed: true,
                video: "oO7_-19AuUI",
                protoResponse: {assType: 'plank'}
              });

              qreq.push({
                type: 's22video',
                desc: "Feet and Ankle Mobility",
                verb: "MOVE",
                timed: true,
                video: "ZQdoCjOpFtQ"
              });

              qreq.push({
                type: 's22weblink',
                desc: "Learn about Sets, Reps and Blocks",
                verb: "TRY",
                timed: true,
                link: "https://livinglab.soton.ac.uk/protocol/"
              });

            break;

          case 2:

              qreq.push({
                type: 's22assessedvideo',
                desc: "Try a wall sit",
                verb: "TRY",
                move: 'wall sit',
                timed: true,
                video: "vOledWwAyFU",
                protoResponse: {assType: 'wallsit'}
              });

              qreq.push({
                type: 's22video',
                desc: "Toe Pulls",
                verb: "MOVE",
                timed: true,
                video: "0Y8La2b8XiA"
              });

              qreq.push({
                type: 's22weblink',
                desc: "Learn about Pushes and Pulls",
                verb: "LEARN",
                timed: true,
                link: "https://livinglab.soton.ac.uk/push-pull/"
              });

              qreq.push({
                type: 's22weblink',
                desc: "Learn about Bilateral Moves",
                verb: "LEARN",
                timed: true,
                link: "https://livinglab.soton.ac.uk/bilateral/"
              });


            break;

          case 3:

            break;

          case 4:

            break;

          case 5:

            break;

          case 6:

            break;
        }
      }
    }

    qreq.push({
      type: 's22other',
      desc: "Add some other movement",
      verb: "ADD",
      timed: true
    });

    team.experiment.tasks[eday] = { required: qreq, optional: others };

    // Add today's minutes total
    team.myMinutesToday = 0;
    team.myTargetToday = false;

    if(team.s22plan.plan) {
      team.myTargetToday = team.s22plan.plan.target;
    }

    team.responses.own.responses.map(function(res){
      if(res.day == eday && res.minutes) {
        team.myMinutesToday += res.minutes;
      }
    })

}

export default { decorateTeam };
