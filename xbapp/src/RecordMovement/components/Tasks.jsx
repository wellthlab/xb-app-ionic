import { useState } from "react";
import { IonList, IonItem, IonItemGroup, IonIcon } from "@ionic/react";
import {
  checkboxOutline,
  squareOutline,
  informationCircleOutline,
  stopwatchOutline,
} from "ionicons/icons";

/**
 * Display a list of the current exercises/tasks to do today
 * Params:
 *  - day      : the active experiment day
 *  - entries  : the team entries for the day to present
 */
function TodoTasks(props) {
  const icon_done = checkboxOutline;
  const icon_missing = stopwatchOutline;
  let [activeDay, setActiveDay] = useState(props.day);
  let [requiredTasks, setRequiredTasks] = useState(
    props.team.experiment.tasks[props.day].required
  );

  let entry = null;
  const dayList = [];
  let entries = props.team.entries;
  for (let i in entries) {
    if (entries[i].day === activeDay) {
      entry = entries[i];
    }
    dayList.push(entries[i].day);
  }

  let totalMinutes = 0;
  const timedTasks = [];
  for (let i in requiredTasks) {
    if (typeof requiredTasks[i].timed !== "undefined") {
      if (requiredTasks[i].timed) {
        timedTasks.push(requiredTasks[i]);
        totalMinutes += requiredTasks[i].mins;
      }
    }
  }

  // then no tasks have been set
  if (timedTasks.length < 1 || entry === null) {
    if (entry === null) {
      console.log(
        "RecordMovement: entry is null for some reason for day",
        activeDay
      );
    }
    return <h3>You have no TIMED TASKS for today</h3>;
  }

  // TODO: double check tasks appear greyed out when done
  const tasks = timedTasks.map((task) => {
    let done = typeof entry.responseTypes[task.type] !== "undefined";
    const week = Math.floor(activeDay / 7);

    // todo: these tasks need to be greyed out when done, somehow
    if (
      task.type === "strength-setter" &&
      "blocks-week-" + week.toString() + "-set" in window.localStorage
    ) {
      done = true;
    }
    if (
      task.type === "strength-explorer" &&
      "blocks-week-0-day-" + activeDay.toString() in window.localStorage
    ) {
      done = true;
    }

    // TODO: href needs updating to exercise information, or disable clicking until it's in
    return (
      <IonItem
        color={done ? "" : "tertiary"}
        key={task.type}
        routerLink={"/"}
        detail={true}
        detailIcon={informationCircleOutline}
      >
        <IonIcon slot="start" icon={done ? icon_done : icon_missing} />
        {task.desc}
      </IonItem>
    );
  });

  return (
    <div>
      <h3> Today, you will </h3>
      <IonList lines="full">
        <IonItemGroup>{tasks}</IonItemGroup>
      </IonList>
      <h3> for a total of {totalMinutes} minutes </h3>
    </div>
  );
}

export default TodoTasks;
