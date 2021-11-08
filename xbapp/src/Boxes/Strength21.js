/**
 * This is the experiment-specific code for the Autumn 2021 Strength Experiment
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

  /**
   * availableExperiments: A list of sub-experiments that are eligible to be
   * started. Must take the form of an array, containing objects as shown
   */
  team.availableExperiments = [];

  console.log("Decorating team. Day: ", team.experiment.day);

  for (var eday = 1; eday <= team.experiment.day; eday++) {

    var week = Math.floor(eday / 7);

    console.log("Add tasks for day/week ", eday, week, " of ", team.experiment.day)

    var qreq = [];
    // Other tasks that can be done, but optionally
    var others = [];

    if (week >= 1) {
      qreq.push({
        type: "strength-setter",
        desc: "Set your current Strength Exercise",
        verb: "DO IT",
      });
    } 
    others.push({ type: "note", desc: "Add Notes", verb: "ADD NOTES" });
    others.push({ type: "minutes", desc: "Add Movement Minutes", verb: "ADD" });


    if (week >= 1) {
      // Strength exercise only on week days
      var dow = eday % 7;
      if (dow == 0 || dow == 6) { //if it's weekend, juat adding it as optional
        others.push({
          type: "strength",
          desc: "Do your Daily Strength Exercise",
          verb: "DO IT",
        });
      } else {
        qreq.push({
          type: "strength",
          desc: "Do your Daily Strength Exercise",
          verb: "DO IT",
        });
      }


      qreq.push({
        type: "questionnaire",
        desc: "Fill in the Daily Review",
        verb: "DO IT",
      });

      if (dow == 1){ //it's a monday
      // if (eday == 1 || eday == 22 || eday == 36) {
        qreq.push({
          type: "assessment",
          desc: "Do a Strength Assessment",
          verb: "DO IT",
        });
      } else {
        others.push({
          type: "assessment",
          desc: "Do a Strength Assessment",
          verb: "DO IT",
        });
      }
    }
    
    if ((week == 0 && eday % 7 == 1) || (week == 1 && eday % 7 == 3) || (week == 7 && eday % 7 == 1) || (week == 16 && eday % 7 == 1) ) {
      qreq.push({
        type: "work-assessment",
        desc: "Do the Work Engagement Questionnaire",
        verb: "DO IT",
      });
    }
    if (week == 0){
      if (eday % 7 == 1){ //is monday
        qreq.push({
          type: "scheduler",
          desc: "Schedule your Workout",
          verb: "DO IT",
        });
      } else if (eday % 7 == 2){ //is poms - tuesday
        qreq.push({
          type: "poms",
          desc: "Do an assessment - POMS",
          verb: "DO IT",
        });
        qreq.push({
          type: "heartrate",
          desc: "Learning HOW TO - Heart rate",
          verb: "DO IT",
        });
        //TODOOOOOOOO
        

      } else if (eday % 7 == 3){ //is walls it and plank- wednesday
        qreq.push({
          type: "plank",
          desc: "Do an assessment - The Plank",
          verb: "DO IT",
        });
        qreq.push({
          type: "wallsit",
          desc: "Do an assessment - The Wall Sit",
          verb: "DO IT",
        });
      } else if (eday % 7 == 4){ //ithursday - understanding pushes pulls
        qreq.push({
          type: "pushpull",
          desc: "Understanding Pushes and Pulls",
          verb: "DO IT",
        });
       
      } else if (eday % 7 == 5){ //is walls it and plank - friday
        qreq.push({
          type: "scheduler",
          desc: "Schedule your Workout",
          verb: "DO IT",
        });
        others.push({
          type: "pushpull",
          desc: "Understanding Pushes and Pulls",
          verb: "DO IT",
        });
        qreq.push({
          type: "quiz",
          desc: "Weekly QUIZ!",
          verb: "DO IT",
        });
      }
    }
    if (week == 0 && eday % 7 == 4) { //thursday
      qreq.push({
        type: "strength-explorer",
        desc: "Explore different Strength Exercises",
        verb: "DO IT",
      });
    } else {
      //if it's exploration week, let the participants know that they can EXPLORE with a strength exercise - without recording it
      others.push({
        type: "strength-explorer",
        desc: "Explore different Strength Exercises",
        verb: "DO IT",
      });
    }

    team.experiment.tasks[eday] = { required: qreq, optional: others };
  } // End day loop

  //if we are in the days prior to the start of the experiment
  for (var eday = -20; eday <= 0; eday++) {

    var week = Math.floor(eday / 7) - 1;

    console.log("Add tasks for day/week ", eday, week, " of ", team.experiment.day)

    var qreq = [];
    // Other tasks that can be done, but optionally
    var others = [
      { type: "strength-explorer", desc: "Explore different Strength Exercises", verb: "DO IT" },
      { type: "note", desc: "Add Notes", verb: "ADD NOTES" },
      { type: "minutes", desc: "Add Movement Minutes", verb: "ADD" },
    ];

    team.experiment.tasks[eday] = { required: qreq, optional: others };
  }
  /**
   * Exercise block information
   */
  /* TODO: Hooks can only be used in react components
 var exList = [];
 var setExList = [];
 [exList[1], setExList[1]] = useLocalStorage(
   "week" + week + "-block1-exlist",
   []
 );
 [exList[2], setExList[2]] = useLocalStorage(
   "week" + week + "-block2-exlist",
   []
 );
 [exList[3], setExList[3]] = useLocalStorage(
   "week" + week + "-block3-exlist",
   []
 );
 [exList[4], setExList[4]] = useLocalStorage(
   "week" + week + "-block4-exlist",
   []
 );
 [exList[5], setExList[5]] = useLocalStorage(
   "week" + week + "-block5-exlist",
   []
 );
 [exList[6], setExList[6]] = useLocalStorage(
   "week" + week + "-block6-exlist",
   []
 );
 [exList[7], setExList[7]] = useLocalStorage(
   "week" + week + "-block7-exlist",
   []
 );

 var blockFlow = [];
 var setBlockFlow = [];
 [blockFlow[1], setBlockFlow[1]] = useState(
   exList[1].length < 2 ? "pick" : "show"
 );
 [blockFlow[2], setBlockFlow[2]] = useState(
   exList[2].length < 2 ? "pick" : "show"
 );
 [blockFlow[3], setBlockFlow[3]] = useState(
   exList[3].length < 2 ? "pick" : "show"
 );
 [blockFlow[4], setBlockFlow[4]] = useState(
   exList[4].length < 2 ? "pick" : "show"
 );
 [blockFlow[5], setBlockFlow[5]] = useState(
   exList[5].length < 2 ? "pick" : "show"
 );
 [blockFlow[6], setBlockFlow[6]] = useState(
   exList[6].length < 2 ? "pick" : "show"
 );
 [blockFlow[7], setBlockFlow[7]] = useState(
   exList[7].length < 2 ? "pick" : "show"
 );
 */

}

export default { decorateTeam };
