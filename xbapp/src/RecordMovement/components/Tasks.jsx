import { useState } from "react";
import {
  IonList,
  IonItem,
  IonItemGroup,
  IonIcon,
  IonButton,
} from "@ionic/react";
import {
  checkboxOutline,
  squareOutline,
  informationCircleOutline,
  stopwatchOutline,
  playOutline,
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
  let [requiredTasks, setRequiredTasks] = useState(props.tasks);
  let totalMinutes = props.minutes;
  let groupID = props.team._id;

  console.log("tasks.jsx requiredTasks", requiredTasks);

  // Get the entry for the day
  let entry = null;
  const dayList = [];
  let entries = props.team.entries;
  for (let i in entries) {
    if (entries[i].day === activeDay) {
      entry = entries[i];
    }
    dayList.push(entries[i].day);
  }

  console.log("entry", entry);

  // then no tasks have been set, so return
  if (requiredTasks.length < 1) {
    if (entry === null) {
      console.log(
        "RecordMovement: entry is null for some reason for day",
        activeDay
      );
    }
    return (
      <div // TODO: add styling to css
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          textAlign: "center",
        }}
      >
        <h3>You have no TIMED TASKS for today</h3>
      </div>
    );
  }

  // TODO: double check tasks appear greyed out when done
  const tasks = requiredTasks.map((task) => {
    let done = false;
    // let done = typeof entry.responseTypes[task.type] !== "undefined";
    // const week = Math.floor(activeDay / 7);

    // // todo: these tasks need to be greyed out when done, somehow
    // if (
    //   task.type === "strength-setter" &&
    //   "blocks-week-" + week.toString() + "-set" in window.localStorage
    // ) {
    //   done = true;
    // }
    // if (
    //   task.type === "strength-explorer" &&
    //   "blocks-week-0-day-" + activeDay.toString() in window.localStorage
    // ) {
    //   done = true;
    // }

    // TODO: href needs updating to exercise information, or disable clicking until it's in
    return (
      <IonItem
        color={done ? "" : "primary"}
        key={task.type}
        routerLink={"/timer/" + groupID + "/" + task.desc}
        // detail={true}
        // detailIcon={informationCircleOutline}
      >
        <IonButton
          fill="clear"
          expand={"full"}
          onClick={() => {
            localStorage.setItem("currentTask", JSON.stringify(task));
          }}
        ></IonButton>
        <IonIcon slot="start" icon={done ? icon_done : playOutline} />
        {task.desc}
      </IonItem>
    );
  });

  return (
    <div>
      <h3> Today, you can </h3>
      <IonList lines="full">
        <IonItemGroup>{tasks}</IonItemGroup>
      </IonList>
      <h3> for a total of {totalMinutes} minutes </h3>
    </div>
  );
}

export default TodoTasks;
