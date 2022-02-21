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

import MinuteEntry from "../UserInput/MinuteEntry";
import Questionnaire from "../UserInput/Questionnaire";
import QuestionnaireEvening from "../UserInput/QuestionnaireEvening";
import QuestionnaireEndWeek from "../UserInput/QuestionnaireEndWeek";
import StrengthWizard from "../Strength/StrengthWizard";
import StrengthExercisePicker from "../DEPRECATED/StrengthExercisePicker";
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
import ManageItQuestion from "../Strength/ManageIt";
import ContextualQuestions from "../Strength/Questions";
import SetCounter from "../Strength/SetCounter";

import React, { useState, useEffect } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonRow,
  IonGrid,
  IonCol,
  IonButton,
  IonRouterLink,
} from "@ionic/react";
import MovementInfoCard from "../Strength/MovementInfoCard";
import { getMove } from "../DEPRECATED/components/OLDMovementPicker";
import SuperSetTask from "../Strength/SupersetTask";
import ManageItTask from "../Strength/ManageIt";

/**
 * Create input widgets based on task type
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
  group,
  daynumber,
  onSubmit,
  info
) {
  // time key is used to re-create rather than re-use elements on subsequent uses
  var time = Date.now();

  var input, typedesc;

  var groupID = group._id;

  // info is an optional param; it's other fields that the type might need
  if (typeof info == "undefined") {
    info = {};
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
      var week = Math.floor((daynumber - 1) / 7);
      typedesc = "Strength";
      input = (
        <StrengthWizard
          countdownID={daynumber + "-" + groupID}
          week={week}
          onSubmit={onSubmit}
        />
      );
      break;

    case "strength-setter":
      var week = Math.floor((daynumber - 1) / 7);
      typedesc = "Strength Picker";
      input = <BlockPlanner onSubmit={onSubmit} explorer={false} week={week} />;
      break;

    case "strength-explorer":
      var week = -1;
      typedesc = "Block Planner";
      input = ( //TODO: define save function for blockplanner
        <BlockPlanner
          onSubmit={onSubmit}
          explorer={true}
          week={week}
          day={daynumber}
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
      var week = Math.floor((daynumber - 1) / 7);
      if (week == 0 && daynumber == 1) {
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
      var week = Math.floor((daynumber - 1) / 7);
      input = <Quiz onSubmit={onSubmit} week={week} />;
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
      input = <Planner onSubmit={onSubmit} group={group} />;
      typedesc = "Weekly Plan";
      break;

    case "s22video":
      input = <Video onSubmit={onSubmit} video={info.video} />;
      typedesc = "Video Move";
      break;

    case "s22assessedvideo":
      input = (
        <>
          <Video onSubmit={onSubmit} video={info.video} />
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Time your {info.move}</IonCardTitle>
              <IonCardSubtitle>
                Timing your move will let you measure your progress
              </IonCardSubtitle>
            </IonCardHeader>
            <Timer
              onPause={(mins) => {
                onSubmit({ assTimeSecs: mins * 60 });
              }}
            />
          </IonCard>
        </>
      );
      typedesc = "Assessment Move";
      break;

    case "s22weblink":
      input = <WebLink onSubmit={onSubmit} link={info.link} info={info} />;
      typedesc = "Web Link";
      break;

    case "s22other":
      input = <OtherMove onSubmit={onSubmit} />;
      typedesc = "Other Movement";
      break;

    case "s22manage":
      input = <ManageItTask task={info} onSubmit={onSubmit} />;
      typedesc = "Manage It";
      break;

    case "s22superset":
      input = <SuperSetTask task={info} onSubmit={onSubmit} />;
      typedesc = "Super Set";
      break;

    default:
      input = <p>Unknown Response Type</p>;
      typedesc = "";
      break;
  }

  return {
    input: input,
    desc: typedesc,
  };
}
