import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import {
  IonCard,
  IonButton,
  IonList,
  IonItem,
  IonItemGroup,
  IonItemDivider,
  IonListHeader,
  IonLabel,
  IonIcon,
} from "@ionic/react";

import {
  heart,
  arrowForward,
  caretForward,
  timer,
  caretBackCircle,
  caretForwardCircle,
  checkmarkCircleOutline,
  closeCircleOutline,
  add,
  addCircle,
  listOutline,
  checkboxOutline,
  squareOutline,
  arrowForwardOutline,
} from "ionicons/icons";

// See todo, below;
// import GenericModal from "./GenericModal";
// import { quizes, getQuiz } from "./GenericModal";

//css
import "./DailyActions.css";

/**
 * Props:
 *    today: The day number to show tasks for
 *    group: The team object to show tasks from
 */
const DailyActions = ({ group, today }) => {
  // Track the day we're displaying; default to current day
  const [activeDay, setActiveDay] = useState(today);

  console.log("Show Tasks", group, today);

  //if the quiz exists/
  /* Not here! Refactor into a task like the other daily tasks
  var codeForQuiz = week.toString() + "." + dayOfWeek;
  const [showQuiz, setShowQuiz] = useState(
    localStorage.getItem("week_" + codeForQuiz + "_quiz") == null &&
      localStorage.getItem("week_" + week.toString() + ".0_quiz") == null
      ? getQuiz(codeForQuiz) || getQuiz(week.toString() + ".0") != false
        ? true
        : false
      : false
  );
  function toggleQuiz() {
    setShowQuiz(!showQuiz);
  }
  */

  var entries = group.entries;
  console.log("just seeing", group);

  // Look up the daily entry we need to render
  var entry;
  var dayList = [];
  for (var i in entries) {
    if (entries[i].day === activeDay) {
      entry = entries[i];
    }
    dayList.push(entries[i].day);
  }

  if (typeof entry == "undefined") {
    return <>Can't find entry for day {activeDay}</>;
  }

  const nextDayExists = dayList.includes(activeDay + 1);
  const prevDayExists = dayList.includes(activeDay - 1);

  var icon_done = checkboxOutline;
  var icon_missing = squareOutline;

  /**
   * Daily task list and buttons
   */

  var required = group.experiment.tasks[activeDay].required;
  var optional = group.experiment.tasks[activeDay].optional;

  var tasks = required.map((type) => {
    var done = typeof entry.responseTypes[type.type] !== "undefined";

    return (
      <IonItem
        color={done ? "neutral" : "warning"}
        key={type.type}
        routerLink={
          "/box/move/" + group._id + "/" + activeDay + "/add/" + type.type
        }
        detail={true}
        detailIcon={arrowForwardOutline}
      >
        <IonIcon slot="start" icon={done ? icon_done : icon_missing} />
        {type.desc}
        {/* <span slot="end">{type.verb} NOW <IonIcon icon={arrowForward} /></span> */}
      </IonItem>
    );
  });

  var otheractions = optional.map((type) => {
    console.log("lets see", type);
    var done = typeof entry.responseTypes[type.type] !== "undefined";
    return (
      <IonItem
        key={type.type}
        routerLink={
          "/box/move/" + group._id + "/" + activeDay + "/add/" + type.type
        }
        detail={true}
        detailIcon={arrowForwardOutline}
      >
        <IonIcon slot="start" icon={done ? icon_done : icon_missing} />
        {type.desc}
        {/* span slot="end">{type.verb} NOW <IonIcon icon={arrowForward} /></span> */}
      </IonItem>
    );
  });

  console.log("REQ,", required);
  var responses = entry.responses;

  return (
    <div className="dailyActions">
      {/*
      TODO: Refactor the quiz into a standalone widget, like the other daily tasks
      <GenericModal
        showModal={showQuiz}
        toggleModal={toggleQuiz}
        title={"Weekly Quiz! :)"}
        quiz={true}
        message={week.toString() + "." + dayOfWeek}
      />*/}
      <div className="headerDay" style={{ display: "block", overflow: "auto" }}>
        <span className="text">
          <h3>
            {nextDayExists
              ? "Day " + activeDay + " : " + entry.date
              : "Today's Tasks"}
          </h3>
        </span>
        <span className="navbuttons">
          {
            <IonButton
              disabled={!prevDayExists}
              onClick={() => {
                setActiveDay(activeDay - 1);
              }}
            >
              <IonIcon icon={caretBackCircle} />
            </IonButton>
          }
          {
            <IonButton
              disabled={!nextDayExists}
              onClick={() => {
                setActiveDay(activeDay + 1);
              }}
            >
              <IonIcon icon={caretForwardCircle} />
            </IonButton>
          }
        </span>
      </div>
      <IonList lines="full" className="journalTasks">
        <IonItemGroup>{required.length != 0 ? tasks : <IonLabel>No task for today.</IonLabel>}</IonItemGroup>
      </IonList>
      <span className="text">
        <h3>Other Activities</h3>
      </span>
      <IonList lines="full" className="journalTasks">
        <IonItemGroup>{otheractions}</IonItemGroup>
      </IonList>
    </div>
  );
};

export default DailyActions;

function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
