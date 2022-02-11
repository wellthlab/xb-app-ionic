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
      effectiveWeek: 4, // The effective week of the study for the participant; might not be the real week!
      daily: { // A daily plan of what blocks to include
        0: {}, // Sunday
        1: { // Monday
          strength: 14, // 14 mins of strength
          cardio: 7 // 7 mins of cardio
        },
        2: { // Tuesday
          strength: 0, // 14 mins of strength
          cardio: 21 // 7 mins of cardio
        },
        3: { // Wednesday
          strength: 14, // 14 mins of strength
          cardio: 7 // 7 mins of cardio
        },
        4: { // Thursday
          strength: 0, // 14 mins of strength
          cardio: 21 // 7 mins of cardio
        },
        5: { // Friday
          strength: 14, // 14 mins of strength
          cardio: 7 // 7 mins of cardio
        },
        6: { // Saturday
          strength: 0,
          cardio: 0
        },
      }
    }
    // End of EXAMPLE plan



    // Try to find a s22 plan
    if(typeof team.lastEntryByType.s22plan !== 'undefined') {
      // Check that the plan is for the current week
      if(team.experiment.week === team.lastEntryByType.s22plan.week) {
        team.s22plan = team.lastEntryByType.s22plan;
        console.log("Found a current s22 plan");
      } else {
        console.log("s22 plan is out of date");
      }
    } else {
      console.log("No s22 plan has ever been saved");
    }

    // Testing tasks
    qreq.push({
      type: 's22assess',
      desc: "Strength Assessment",
      verb: "MOVE",
      mins: 7, // TODO: We actually want video task to be timed loosely, like spend longer if you like
      timed: true
    });
    qreq.push({
      type: 's22video',
      desc: "Feet and Ankle Mobility",
      verb: "MOVE",
      mins: 7, // TODO: We actually want video task to be timed loosely, like spend longer if you like
      timed: true
    });

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
        qreq.push({
          type: 's22plan',
          desc: 'You need to plan your week',
          verb: 'PLAN'
        });
      }

    } else {
      var dow = (new Date()).getDay();
      var dayplan = team.s22plan.daily[dow];

      others.push({
        type: 's22plan',
        desc: 'You can change your weekly plan',
        verb: 'PLAN'
      });

      // Set up other tasks according to week number
      // TODO: This might need to be influenced by pathway?
      var effWeek = team.s22plan.effectiveWeek;
      if(effWeek == 1) {
        switch(dow) {

          case 1:
            qreq.push({
              type: 's22assess',
              desc: "Strength Assessment",
              verb: "MOVE",
              mins: 7, // TODO: We actually want video task to be timed loosely, like spend longer if you like
              timed: true
            });
            qreq.push({
              type: 's22video',
              desc: "Feet and Ankle Mobility",
              verb: "MOVE",
              mins: 7, // TODO: We actually want video task to be timed loosely, like spend longer if you like
              timed: true
            });
            break;

          case 2:
            qreq.push({
              type: 's22strength',
              moves: ['', ''], // Specify the two moves; should disable the move picker
              desc: "Pull and Push",
              verb: "MOVE",
              mins: 7, // TODO: We actually want video task to be timed loosely, like spend longer if you like
              timed: true
            });
            qreq.push({
              type: 's22video',
              desc: "Feet and Ankle Mobility",
              verb: "MOVE",
              mins: 7, // TODO: We actually want video task to be timed loosely, like spend longer if you like
              timed: true
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

      // Add strength blocks
      if(dayplan.strength > 0) {
        for(var i = 1; i < Math.ceil(dayplan.strength / 7); i++) {
          qreq.push({
            type: 's22strength',
            desc: "Resistance Block " + i,
            verb: "MOVE",
            mins: 7,
            timed: true
          });
        }
      }

      // Add the cardio block
      if(dayplan.cardio > 0) {
          qreq.push({
            type: 's22cardio',
            desc: "Cardio Block",
            verb: "MOVE",
            mins: dayplan.cardio,
            timed: true
          });
      }


    }


    team.experiment.tasks[eday] = { required: qreq, optional: others };
}

export default { decorateTeam };
