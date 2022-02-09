import { useState, useEffect } from "react";
import {
  IonButton,
  IonList,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonIcon,
  IonHeader,
  IonTitle,
} from "@ionic/react";

import {
  caretBlackCricle,
  caretForwardCircle,
  checkboxOutline,
  squareOutline,
  arrowForwardOutline,
} from "ionicons/icons";

import "./dayTasks.css";

/**
 * @param {*} group: The team object to show tasks from
 * @param {*} today: The day number to show tasks for
 */
function DayTasks({ group }) {
  const day = group.experiment.day;
  const week = group.experiment.week;
  const [activeDay, setActiveDay] = useState(day);

  let icon_done = checkboxOutline;
  let icon_missing = squareOutline;
  let entries = group.entries;

  // Look up the daily entry we need to render
  var entry;
  var dayList = [];
  for (var i in entries) {
    if (entries[i].day === activeDay) {
      entry = entries[i];
    }
    dayList.push(entries[i].day);
  }

  let required = group.experiment.tasks[activeDay].required;

  let tasks = required.map((type) => {
    let done = typeof entry.responseTypes[type.type] !== "undefined";
    let week = Math.floor(activeDay / 7);

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
          "/box/move/" + group._id + "/" + activeDay + "/add/" + type.type
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
          {tasks.length !== 0 ? (
            tasks
          ) : (
            <IonLabel>No tasks for today.</IonLabel>
          )}
        </IonItemGroup>
      </IonList>
    </div>
  );
}

export default DayTasks;
