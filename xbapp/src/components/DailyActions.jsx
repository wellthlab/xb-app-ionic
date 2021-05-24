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

import GenericModal from "./GenericModal";
import { quizes, getQuiz } from "./GenericModal";

//css
import "./DailyActions.css";

/**
 * Props:
 *
 */
const DailyActions = ({ group, today }) => {
  // Track the day we're displaying; default to current day
  const [activeDay, setActiveDay] = useState(today);

  var week = Math.floor((activeDay - 1) / 7) + 1;
  var dayOfWeek =
    activeDay - (week - 1) * 7 == 0
      ? "7"
      : (activeDay - (week - 1) * 7).toString();
  var blocks = Math.max(1, week - 1);

  //if the quiz exists/
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

  //retrieving the exercise blocks in order to CHECK if they are selected
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

  //finished retrieving teh blocks

  var entries = group.entries;

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
  var qreq = [];
  if (week > 1) {
    qreq.push({
      type: "strength-exercise",
      desc: "Set your current Strength Exercise",
      verb: "DO IT",
    });
  } else {
    //if it's exploration week, let the participants know that they can PRACTICE with a strength exercise - without recording it
    qreq.push({
      type: "strength-exercise",
      desc: "Explore different Strength Exercises",
      verb: "DO IT",
    });
  }

  // Other tasks that can be done, but optionally
  var others = [
    { type: "note", desc: "Add Notes", verb: "ADD NOTES" },
    { type: "minutes", desc: "Add Movement Minutes", verb: "ADD" },
  ];

  // Strength exercise only on week days
  var day = new Date().getDay();
  if (day == 0 || day == 6) {
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

  var day = entry.day;
  if (day == 1 || day == 22 || day == 36) {
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

  //check if exercises are set
  function checkIfExercisesAreSet() {
    for (var blocknum = 1; blocknum <= blocks; blocknum++) {
      if (blockFlow[blocknum] == "pick") return false;
    }
    return true;
  }

  var tasks = qreq.map((type) => {
    var responseExists = typeof entry.responseTypes[type.type] !== "undefined";
    var done =
      type.type == "strength-exercise"
        ? checkIfExercisesAreSet()
          ? true
          : false
        : responseExists;

    // console.log(type.type, done);
    console.log(
      "ACTTT ",
      week,
      type.type,
      week > 1,
      type.type != "strength-exercise"
    );
    return (
      <IonItem
        color={
          week == 1 && type.type == "strength-exercise"
            ? "neutral"
            : done
            ? "neutral"
            : "warning"
        }
        key={type.type}
        routerLink={
          "/group/" + group._id + "/" + activeDay + "/add/" + type.type
        }
        detail={true}
        detailIcon={arrowForwardOutline}
      >
        {/*Hide checkbox icon when it's week 1 - because they can access it whenever they wish*/}
        {week == 1 && type.type == "strength-exercise" ? (
          <></>
        ) : (
          <IonIcon slot="start" icon={done ? icon_done : icon_missing} />
        )}

        {type.desc}
        {/* <span slot="end">{type.verb} NOW <IonIcon icon={arrowForward} /></span> */}
      </IonItem>
    );
  });

  var otheractions = others.map((type) => {
    var done = typeof entry.responseTypes[type.type] !== "undefined";
    return (
      <IonItem
        key={type.type}
        routerLink={
          "/group/" + group._id + "/" + activeDay + "/add/" + type.type
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

  var responses = entry.responses;

  return (
    <div className="dailyActions">
      <GenericModal
        showModal={showQuiz}
        toggleModal={toggleQuiz}
        title={"Weekly Quiz! :)"}
        quiz={true}
        message={week.toString() + "." + dayOfWeek}
      />
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
        <IonItemGroup>{tasks}</IonItemGroup>
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
