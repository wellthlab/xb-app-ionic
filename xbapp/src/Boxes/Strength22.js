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

    // Set up other tasks according to week number
    // var effWeek = team.s22plan.plan.effectiveWeek;
    let effWeek = team.experiment.week;
    console.log("effWeek", effWeek);

    let enduranceTaskText = (
      <>
        <IonRow>
          <IonCol>
            For <strong>BUILDER ENDURANCE</strong> this week – go for a walk – or some other non-stop activity that you can do that elevates your pulse above what it is when you're standing. GO for 1-4 blocks as you wish.
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            For <strong>Explorers</strong>, we suggest following the BUILDER strength protocol for at least 2 of the three days and for endurance days, please likewise feel free to follow this path or do your own thing.
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            For <strong>Experimentalists</strong> – for those days of the week you might not have a practice – since the target is 35 movement minutes a day – please feel welcome to use our patterns.
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            For <strong>Flaneurs</strong> – please consider keeping up with the mobility before your daily walks/strolls/cycles or other mildly pulse elevating efforts.
          </IonCol>
        </IonRow>
      </>
      );

    if(effWeek === 1) {
      switch(dow) {
        case 1:
            required.push({
              intype: 's22assessedvideo',
              desc: "Try a plank",
              verb: "TRY",
              move: 'plank',
              timed: true,
              video: "oO7_-19AuUI",
              protoResponse: {assintype: 'plank'}
            });
            required.push({
              intype: 's22video',
              desc: "Feet and Ankle Mobility",
              verb: "MOVE",
              timed: true,
              video: "ZQdoCjOpFtQ"
            });
            required.push({
              intype: 's22weblink',
              desc: "Learn about Sets, Reps and Blocks",
              verb: "TRY",
              timed: true,
              link: "https://livinglab.soton.ac.uk/protocol/"
            });
          break;
        case 2:
            required.push({
              intype: 's22assessedvideo',
              desc: "Try a wall sit",
              verb: "TRY",
              move: 'wall sit',
              timed: true,
              video: "vOledWwAyFU",
              protoResponse: {assintype: 'wallsit'}
            });
            required.push({
              intype: 's22video',
              desc: "Toe Pulls",
              verb: "MOVE",
              timed: true,
              video: "0Y8La2b8XiA"
            });
            required.push({
              intype: 's22weblink',
              desc: "Learn about Pushes and Pulls",
              verb: "LEARN",
              timed: true,
              link: "https://livinglab.soton.ac.uk/push-pull/"
            });
            required.push({
              intype: 's22weblink',
              desc: "Learn about Bilateral Moves",
              verb: "LEARN",
              timed: true,
              link: "https://livinglab.soton.ac.uk/bilateral/"
            });
          break;
        case 3:
          required.push({
            intype: "s22manage",
            desc: "Try a sit and stand",
            verb: "TRY",
            move: "sit and stand",
            timed: true,
            video: "T7AFlh9HZrs",
            });
          required.push({
            intype: "s22video",
            desc: "Knee and hip mobility",
            verb: "MOVE",
            timed: true,
            video: "bWkPB4WgTn0"
          });
          required.push({
            intype: "s22weblink",
            desc: "Learn about unilateral moves",
            verb: "LEARN",
            timed: true,
            link: "https://livinglab.soton.ac.uk/unilaterals/"
          });
          break;
        case 4:
          required.push({
            intype: "s22assessedvideo",
            desc: "Try to balance",
            verb: "TRY",
            move: "balance",
            timed: true,
            video: "X_2hjT0MmfQ",
          });
          required.push({
            intype: "s22video",
            desc: "Mid-back, neck and jaw mobility",
            verb: "MOVE",
            timed: true,
            video: "eMQSeR50d00",
          });
          required.push({
            intype: "strength-setter",
            desc: "Set your strength tasks",
            verb: "SET",
            timed: false,
          })
          break;
        case 5:
          required.push({
            intype: "s22weblink",
            desc: "Measure your body fat",
            verb: "TRY",
            timed: true,
            link: "https://www.mytecbits.com/tools/medical/navy-body-fat-calculator"
          });
          required.push({
            intype: "s22video",
            desc: "Shoulder and hand mobility",
            verb: "MOVE",
            timed: true,
            link: ""
          })
          required.push({
            intype: "s22video",
            desc: "Putting sequences together",
            verb: "MOVE",
            timed: true,
            video: "QMvhS5GwuX4"
          })
          break;
        default:
          break;
      }
    }
    else if (effWeek === 2) {
      switch(dow) {
        case 1:
          required.push({
            type: "schedule-workout",
            intype: "s22weblink",
            desc: "Schedule an IN-WORK workout for this week",
            verb: "TRY",
            timed: true,
            s22onPath: "all",
            link: "https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fl%2Fmessage%2F19%3A60c75cb3463c4058b84a340287e7b2f1%40thread.tacv2%2F1645091058587%3FtenantId%3D4a5378f9-29f4-4d3e-be89-669d03ada9d8%26groupId%3Dadc60861-6f1c-42e3-bdcc-a05902c45f71%26parentMessageId%3D1645091058587%26teamName%3Ds22%2520Strength%2520In%2520Work%252022%26channelName%3D1.%2520%2520Experiments%2520(OPTIONAL)%26createdTime%3D1645091058587&type=message&deeplinkId=3d594a88-487a-45d1-940b-c26dc6b83bba&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true"
          })
          required.push({
            type: "neuro-mobility",
            intype: "s22video",
            desc: "Neuro mobility",
            verb: "MOVE",
            video: "ok5GEVxx5FI",
            timed: true,
            s22onPath: "all"
          })
          required.push({
            type: "adjust-squats",
            intype: "s22video",
            desc: "How to adjust squats",
            verb: "TRY",
            video: "BUnxylgbNNw",
            timed: true,
            s22onPath: "all"
          })
          required.push({
            type: "adjust-pushups",
            intype: "s22video",
            desc: "How to adjust push ups",
            verb: "TRY",
            video: "Ezg6pGr3Su8",
            timed: true,
            s22onPath: "all",
          })
          required.push({
            type: "how-to-edt",
            intype: "s22video",
            desc: "How to EDT",
            verb: "TRY",
            video: "PWyhF5_WazY",
            timed: true,
            s22onPath: "all"
          })
          required.push({
            type: "edt-block-0",
            intype: "s22superset",
            desc: "Practise set EDT",
            verb: "SET",
            timed: true,
            s22onPath: "all",
            strengthBlock: 0
          })
            break;
        case 2:
          required.push({
            type: "neck-mobility",
            intype: "s22video",
            desc: "Neck mobility",
            verb: "MOVE",
            timed: true,
            s22onPath: "all",
            video: "jvxDJL_cfFU"
          })
          required.push({
            type: "questions",
            intype: "s22questions",
            desc: "Where are you?",
            verb: "QUESTION",
            timed: true,
            s22onPath: "all"
          })
          required.push({
            type: "endurance-block",
            intype: "s22instructions",
            desc: "Endurance",
            verb: "MOVE",
            timed: true,
            s22onPath: "all",
            text: enduranceTaskText,
          })
          break;
        case 3:
          required.push({
            type: "shoulder-mobility",
            intype: "s22video",
            desc: "Shoulder mobility",
            verb: "MOVE",
            timed: true,
            s22onPath: "all",
            video: "FIsBwVfWal8"
          });
          required.push({
            type: "questions",
            intype: "s22questions",
            desc: "Where are you?",
            verb: "QUESTION",
            timed: true,
            s22onPath: "all"
          })
          required.push({
            type: "strength-setter",
            intype: "strength-setter",
            desc: "Set your strength tasks",
            verb: "SET",
            timed: false,
            s22onPath: "all",
          })
          required.push({
            type: "edt-block-1",
            intype: "s22edtset",
            desc: "EDT Set - block 1",
            verb: "SET",
            timed: true,
            s22onPath: "all",
            strengthBlock: 0,
          })
          break;
        case 4:
          required.push({
            type: "elbow-mobility",
            intype: "s22video",
            desc: "Elbow mobility",
            verb: "MOVE",
            timed: true,
            s22onPath: "all",
            video: "whOriwozb3g"
          });
          required.push({
            type: "endurance-block",
            intype: "s22instructions",
            desc: "Endurance",
            verb: "MOVE",
            timed: true,
            s22onPath: "all",
            text: enduranceTaskText,
          })
          break;
        case 5:
          required.push({
            type: "wrist-finger-mobility",
            intype: "s22video",
            desc: "Wrist and finger mobility",
            verb: "MOVE",
            timed: true,
            s22onPath: "all",
            video: "zrcuBwZsHXo"
          });
          required.push({
            type: "strength-setter",
            intype: "strength-setter",
            desc: "Set your EDT strength moves",
            verb: "SET",
            timed: false,
            s22onPath: "all",
          })
          required.push({
            type: "edt-block-1",
            intype: "s22edtset",
            desc: "EDT Set",
            verb: "SET",
            timed: true,
            s22onPath: "all",
            strengthBlock: 0,
          })
          break;
        default:
            break;
      }
    }
    else if (effWeek === 3) {
      switch (dow) {
        case 1:
          required.push({
            type: "strength-setter",
            intype: "strength-setter",
            desc: "Set your EDT strength moves",
            verb: "SET",
            timed: false,
            s22onPath: "all",
          })
          // required.push({
          //   type: "neuro-mobility",
          //   intype: "s22video",
          //   desc: " mobility",
          //   verb: "MOVE",
          //   video: "",
          //   timed: true,
          //   s22onPath: "all"
          // })
          required.push({
            type: "adjust-pulls",
            intype: "s22video",
            desc: "How to adjust pull ups",
            verb: "LEARN",
            video: "C3On8eprnew",
            timed: true,
            s22onPath: "all"
          })
          required.push({
            type: "adjust-rows",
            intype: "s22video",
            desc: "How to adjust rows",
            verb: "LEARN",
            video: "IGOPgua09_4",
            timed: true,
            s22onPath: "all",
          })
          required.push({
            type: "adjust-hinges",
            intype: "s22video",
            desc: "How to adjust hinges",
            verb: "LEARN",
            video: "NEZwCyFwAqM",
            timed: true,
            s22onPath: "all",
          })
          required.push({
            type: "mobility-task",
            intype: "s22weblink",
            desc: "Do some mobility moves",
            verb: "MOVE",
            link: "https://www.youtube.com/playlist?list=PLVjNXk5AEPaHtRCEfLNOINs3Q5SojEMAS",
            timed: true,
            s22onPath: "all",
          })
          required.push({
            type: "questions",
            intype: "s22questions",
            desc: "How are you moving?",
            verb: "QUESTION",
            timed: true,
            s22onPath: "all"
          })
          required.push({
            type: "edt-block-1",
            intype: "s22edtset",
            desc: "EDT set: upper and lower pull",
            verb: "SET",
            timed: true,
            s22onPath: "all",
            strengthBlock: 0
          })
          // required.push({
          //   type: "edt-block-2",
          //   intype: "s22superset",
          //   desc: "EDT Set: pull",
          //   verb: "SET",
          //   timed: true,
          //   s22onPath: "all",
          //   strengthBlock: 1
          // })
            break;
        default:
          break;
      }
    }
  }



  // required.push({
  //   type: "daily-quiz",
  //   intype: "quiz",
  //   desc: "Quiz",
  //   verb: "QUESTION",
  //   timed: true,
  //   s22onPath: "all"
  // })

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
