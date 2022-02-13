import { useState } from "react";
import {
  IonList,
  IonItem,
  IonItemGroup,
  IonIcon,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonListHeader
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

  let activeDay = props.day;
  let totalMinutes = props.minutes;
  let groupID = props.team._id;
  let requiredTasks = props.tasks;

  // Get the entry for the day
  let entry = null;
  const dayList = [];
  let entries = props.team.entries;
  for (let i in entries) {
    if (entries[i].day === activeDay) {
      entry = entries[i];
    }
  }

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
  const tasks = requiredTasks.map((task, taskindex) => {
    let done = false;

    return (
      <IonItem
        color={done ? "" : "primary"}
        key={taskindex}
        routerLink={"/timer/" + groupID + "/" + activeDay + "/" + task.type + "/" + taskindex}
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
    <IonList lines="full">
      <IonListHeader>Today's Activities</IonListHeader>
      <IonItemGroup>{tasks}</IonItemGroup>
    </IonList>
  );
}

export default TodoTasks;
