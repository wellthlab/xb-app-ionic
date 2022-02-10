import { useState, useEffect } from "react";
import {
  IonList,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonIcon,
} from "@ionic/react";

import {
  checkboxOutline,
  squareOutline,
  arrowForwardOutline,
} from "ionicons/icons";

import "./DayTasks.css";

/**
 * Display a list of the current exercises/tasks to do today
 *
 * @param {Object} group  the group the person belongs to
 */
function DayTasks({ team }) {
  const [activeDay, setActiveDay] = useState(team.experiment.day);
  const icon_done = checkboxOutline;
  const icon_missing = squareOutline;
  const entries = team.entries;

  // Look up the daily entry we need to render
  let entry;
  const dayList = [];
  for (var i in entries) {
    if (entries[i].day === activeDay) {
      entry = entries[i];
    }
    dayList.push(entries[i].day);
  }

  const required = team.experiment.tasks[activeDay].required;
  const tasks = required.map((type) => {
    let done = typeof entry.responseTypes[type.type] !== "undefined";
    const week = Math.floor(activeDay / 7);

    if (
      type.type === "strength-setter" &&
      "blocks-week-" + week.toString() + "-set" in window.localStorage
    ) {
      done = true;
    }
    if (
      type.type === "strength-explorer" &&
      "blocks-week-0-day-" + activeDay.toString() in window.localStorage
    ) {
      done = true;
    }

    return (
      <IonItem
        color={done ? "neutral" : "warning"}
        key={type.type}
        routerLink={
          "/box/move/" + team._id + "/" + activeDay + "/add/" + type.type
        }
        detail={true}
        detailIcon={arrowForwardOutline}
      >
        <IonIcon slot="start" icon={done ? icon_done : icon_missing} />
        {type.desc}
      </IonItem>
    );
  });

  return (
    <div className="dailyActions">
      <h3> Today, you will </h3>
      <IonList lines="full" className="journalTasks">
        <IonItemGroup>
          {tasks.length !== 0 ? tasks : <IonLabel>No tasks for today</IonLabel>}
        </IonItemGroup>
      </IonList>
      <h3>for a total of TIME minutes</h3>
    </div>
  );
}

export default DayTasks;
