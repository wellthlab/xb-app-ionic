/**
 * A helper factory for turning response types into response widgets

 task: A task object
 onSubmit: A callback function  for when the input is saved

 * returns an object in the form
 * {
      input: <input component>
      desc: a type description string
 * }
 */

import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from "@ionic/react";

import MinuteEntry from "../UserInput/MinuteEntry";
import Questionnaire from "../UserInput/Questionnaire";
import QuestionnaireEvening from "../UserInput/QuestionnaireEvening";
import QuestionnaireEndWeek from "../UserInput/QuestionnaireEndWeek";
import StrengthWizard from "../Strength/StrengthWizard";
import Assessment from "../Strength/Assessment";
import Note from "../UserInput/Note";
import WorkAssessment from "../UserInput/WorkAssessment";
import HeartRateTask from "../UserInput/HeartRateTask";
import Quiz from "../UserInput/Quiz";
import Scheduler from "../UserInput/Scheduler";
import POMS from "../UserInput/POMS";
import Plank from "../UserInput/Plank";
import WallSit from "../UserInput/WallSit";
import PushPull from "../UserInput/PushPull";
import BlockPlanner from "../MovementPuzzlePicker/BlockPlanner";
import PathSelector from "../Strength/PathSelector";
import Planner from "../Strength/Planner";
import Video from "../Strength/Video";
import WebLink from "../Strength/WebLink";
import OtherMove from "../Strength/OtherMove";
import Timer from "../Instruments/StatelessTimer";
import EDTSet from "../Strength/EdtTask";
import ManageItTask from "../Strength/ManageIt";
import ContextualQuestions from "../Strength/Questions";
import Text from "../Strength/Text";
import TopicButtons from "../Playlists/components/module/TopicButtons";
import quizFactory from "../Quiz/quizFactory";
import Image from "../Strength/Image";
import Journal from "../Strength/Journal";

/**
 * Create input widgets based on task type}
 * type: The type of task to generate widgets for
 * group: The group ID that the task belongs to
 * daynumber: The day number of the experiment within the group
 * onSubmit: A callback that receives a response from the widget(s) [see note, below]
 * info: The full task object; some types need this

 Note on onSubmit:

 1) Some widgets will trigger onSubmit multiple times; handle it nicely
 2) Some widgets are actually composed of multiple, each of which will trigger onSubmit; so you probably want to merge the response objects together!

 */
export default function responseFactory(
  type,
  team,
  stageNumber,
  taskNumber,
  userProfile,
  onSubmit,
  task = undefined
) {
  // time key is used to re-create rather than re-use elements on subsequent uses
  var input, typedesc;
  var time = Date.now();
  var teamId = team._id;
  let week = team.experiment.week;
  let day = team.experiment.day;

  // task is an optional param; it's the task object and contains other fields that the type might need
  if (typeof task == "undefined") {
    task = {
      input: "",
      desc: "",
    };
  }

  switch (type) {
    case "minutes":
      typedesc = "Minutes";
      input = <MinuteEntry key={time} onSubmit={onSubmit} />;
      break;

    case "questionnaire":
      typedesc = "Questionnaire";
      input = <Questionnaire key={time} onSubmit={onSubmit} />;
      break;

    case "questionnaire-evening":
      typedesc = "Questionnaire";
      input = <QuestionnaireEvening key={time} onSubmit={onSubmit} />;
      break;

    case "questionnaire-endWeek":
      typedesc = "Questionnaire";
      input = <QuestionnaireEndWeek key={time} onSubmit={onSubmit} />;
      break;

    case "strength":
      typedesc = "Strength";
      input = (
        <StrengthWizard
          countdownID={stageNumber + "-" + teamId}
          week={week}
          onSubmit={onSubmit}
        />
      );
      break;

    case "strength-setter":
      typedesc = "Strength Picker";
      input = <BlockPlanner onSubmit={onSubmit} explorer={false} week={week} />;
      break;

    case "strength-explorer":
      week = -1;
      typedesc = "Block Planner";
      input = (
        <BlockPlanner
          onSubmit={onSubmit}
          explorer={true}
          week={week}
          day={stageNumber}
        />
      );
      break;

    case "work-assessment":
      input = <WorkAssessment onSubmit={onSubmit} />;
      typedesc = "Work Assessment";
      break;

    case "hearttare":
      input = <HeartRateTask onSubmit={onSubmit} />;
      typedesc = "Heart Rate";
      break;

    case "scheduler":
      var planner = [];
      if (week === 0 && stageNumber === 1) {
        planner = [
          { day: "Tuesday", isChecked: false },
          { day: "Wednesday", isChecked: false },
          { day: "Thursday", isChecked: false },
          { day: "Friday", isChecked: false },
        ];
      } else {
        planner = [
          { day: "Monday", isChecked: false },
          { day: "Tuesday", isChecked: false },
          { day: "Wednesday", isChecked: false },
          { day: "Thursday", isChecked: false },
          { day: "Friday", isChecked: false },
        ];
      }
      input = <Scheduler onSubmit={onSubmit} daysCalendar={planner} />;
      break;

    case "poms":
      input = <POMS onSubmit={onSubmit} />;
      typedesc = "POMS";
      break;

    case "plank":
      input = <Plank onSubmit={onSubmit} />;
      typedesc = "Plank";
      break;

    case "wallsit":
      input = <WallSit onSubmit={onSubmit} />;
      typedesc = "Wall Sit";
      break;

    case "assessment":
      input = <Assessment onSubmit={onSubmit} />;
      typedesc = "Assessment";
      break;

    case "heartrate":
      input = <HeartRateTask onSubmit={onSubmit} />;
      typedesc = "HeartRate";
      break;

    case "quiz":
      input = <Quiz onSubmit={onSubmit} task={task} />;
      typedesc = "Quiz";
      break;

    case "pushpull":
      input = <PushPull onSubmit={onSubmit} />;
      typedesc = "Pushes and Pulls";
      break;

    case "note":
      input = <Note onSubmit={onSubmit} />;
      typedesc = "Note";
      break;

    case "s22path":
      input = <PathSelector onSubmit={onSubmit} />;
      typedesc = "Path Picker";
      break;

    case "s22plan":
      input = <Planner onSubmit={onSubmit} group={team} />;
      typedesc = "Weekly Plan";
      break;

    case "s22video":
      input = (
        <Video videoKey={taskNumber} onSubmit={onSubmit} video={task.video} />
      );
      typedesc = "Video Move";
      break;

    case "s22assessedvideo":
      input = (
        <>
          <Video videoKey={taskNumber} onSubmit={onSubmit} video={task.video} />
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                Time your {task.move ? task.move : "move"}
              </IonCardTitle>
              <IonCardSubtitle>
                Timing will let you measure your progress
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <Timer
                onPause={(mins) => {
                  onSubmit({ assTimeSecs: mins * 60 });
                }}
              />
            </IonCardContent>
          </IonCard>
        </>
      );
      typedesc = "Assessment Move";
      break;

    case "s22weblink":
      input = <WebLink onSubmit={onSubmit} link={task.link} info={task} />;
      typedesc = "Web Link";
      break;

    case "s22other":
      input = <OtherMove onSubmit={onSubmit} task={task} />;
      typedesc = "Other Movement";
      break;

    case "s22manage":
      input = <ManageItTask task={task} onSubmit={onSubmit} />;
      typedesc = "Manage It";
      break;

    case "s22edtset":
      input = (
        <EDTSet
          task={task}
          team={team}
          userProfile={userProfile}
          groupId={teamId}
          day={day}
          week={week}
          onSubmit={onSubmit}
        />
      );
      typedesc = "Super Set";
      break;

    case "s22questions":
      input = <ContextualQuestions onSubmit={onSubmit} />;
      typedesc = "Questions";
      break;

    case "s22instructions":
      input = <Text task={task} />;
      typedesc = "Instructions";
      break;

    case "s22subscribe":
      input = <TopicButtons />;
      typedesc = "Subscribe";
      break;

    case "s22quiz":
      const quizInput = [];
      for (let i in task.quiz) {
        const subQ = task.quiz[i];
        quizInput.push(quizFactory(subQ.tag, subQ.type, subQ, onSubmit));
      }
      input = (
        <>
          <IonCard> {quizInput}</IonCard>
        </>
      );
      typedesc = "Quiz";
      break;

    case "s22timedimage":
      input = <Image imgSrc={"./assets/" + task.image} />;
      typedesc = "Image";
      break;

    case "s22journal":
      input = <Journal message={task.prompt} onSubmit={onSubmit} />;
      typedesc = "Journal";
      break;

    default:
      input = (
        <p>
          Unknown response type of {task.intype} for task {task.desc}{" "}
        </p>
      );
      typedesc = "";
      break;
  }
  return {
    input: input,
    desc: typedesc,
  };
}
