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
function DayTasks(props) {
  const icon_done = checkboxOutline;
  const icon_missing = squareOutline;
  let [activeDay, setActiveDay] = useState(props.day);
  let entries = props.team.entries;

  let entry = null;
  const dayList = [];
  for (var i in entries) {
    if (entries[i].day === activeDay) {
      entry = entries[i];
    }
    dayList.push(entries[i].day);
  }

  let [requiredTasks, setRequiredTasks] = useState(props.team.experiment.tasks);
  // let requiredTasks = ["Eat some breakfast", "Try to walk somewhere"];

  // then no tasks have been set
  if (entry.missing || entry === null) {
    return <h3>You have no EXERCISES set for today</h3>;
  }

  const tasks = requiredTasks.map((type) => {
    let done = typeof entry.responseTypes[type.type] !== "undefined";
    const week = Math.floor(activeDay / 7);

    // TODO: this needs changing to use the actual task information
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

    // TODO: href needs updating to exercise information
    return (
      <IonItem
        color={done ? "" : "tertiary"}
        key={type.type}
        routerLink={"/"}
        detail={true}
        detailIcon={informationCircleOutline}
      >
        <IonIcon slot="start" icon={done ? icon_done : stopwatchOutline} />
        {type.desc}
      </IonItem>
    );
  });

  return (
    <div>
      <h3> Today, you will </h3>
      <IonList lines="full">
        <IonItemGroup>{tasks}</IonItemGroup>
      </IonList>
      <h3> for a total of TIME minutes </h3>
    </div>
  );
}

export default DayTasks;
