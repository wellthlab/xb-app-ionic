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
 *    tabs: Whether to allow paging between days (True/False)
 */
const DailyActions = ({ group, today, tabs }) => {
  // Track the day we're displaying; default to current day
  const [activeDay, setActiveDay] = useState(today);

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

  var required = group.experiment.tasks[activeDay].required;
  var optional = group.experiment.tasks[activeDay].optional;

  var tasks = required.map((type) => {
    if (type.timed) {
      return;
    }

    var done = typeof entry.responseTypes[type.intype] !== "undefined";
    return (
      <IonItem
        color={done ? "neutral" : "warning"}
        key={type.type}
        routerLink={
          "/box/move/" + group._id + "/" + activeDay + "/add/" + type.intype
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
    if (type.timed) {
      return;
    }

    var done = typeof entry.responseTypes[type.intype] !== "undefined";
    return (
      <IonItem
        key={type.type}
        routerLink={
          "/box/move/" + group._id + "/" + activeDay + "/add/" + type.intype
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

  var daytabs;
  if (typeof tabs == "undefined" || tabs == true) {
    daytabs = (
      <div className="headerDay" style={{ display: "block", overflow: "auto" }}>
        <span className="text">
          <h3>{"Day " + activeDay + " : " + entry.date}</h3>
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
    );
  } else {
    daytabs = <></>;
  }

  return (
    <div className="dailyActions">
      <IonList lines="full" className="journalTasks">
        <IonItemGroup>
          {required.length != 0 ? (
            tasks
          ) : (
            <IonLabel>No tasks need your attention</IonLabel>
          )}
        </IonItemGroup>
      </IonList>

      <IonList lines="full" className="journalTasks">
        <IonItemGroup>{otheractions}</IonItemGroup>
      </IonList>
    </div>
  );
};

export default DailyActions;
