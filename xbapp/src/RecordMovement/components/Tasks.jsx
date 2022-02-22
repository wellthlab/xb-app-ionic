import {
  IonList,
  IonItem,
  IonItemGroup,
  IonIcon,
  IonButton,
  IonListHeader,
} from "@ionic/react";
import { checkboxOutline, playOutline } from "ionicons/icons";

/**
 * Display a list of the current exercises/tasks to do today
 * Params:
 *  - day      : the active experiment day
 *  - entries  : the team entries for the day to present
 */
function TodoTasks(props) {
  const icon_done = checkboxOutline;

  let activeDay = props.day;
  let groupID = props.team._id;
  let requiredTasks = props.tasks;
  let optionalTasks = props.optional;

  // then no tasks have been set, so return
  if (requiredTasks.length < 1) {
    return (
      <div
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

  // TODO: make tasks appear greyed out when done
  // Required tasks for the users' path
  const tasks = requiredTasks.map((task, taskindex) => {
    let done = false;

    if (
      task.timed &&
      task.s22onPath &&
      (task.s22path === "all" || task.s22path === props.team.s22path.path)
    ) {
      return (
        <IonItem
          color={done ? "" : "primary"}
          key={taskindex}
          routerLink={
            "/timer/" +
            groupID +
            "/" +
            activeDay +
            "/" +
            task.type +
            "/" +
            taskindex
          }
        >
          <IonButton fill="clear" expand={"full"}></IonButton>
          <IonIcon slot="start" icon={done ? icon_done : playOutline} />
          {task.desc}
        </IonItem>
      );
    }
  });

  // Optional tasks for the users' path
  // This could also include tasks from other paths TODO: implement this
  const optional = optionalTasks.map((task, taskindex) => {
    let done = false;

    if (task.timed && task.s22onPath) {
      return (
        <IonItem
          color={done ? "" : "secondary"}
          key={taskindex}
          routerLink={
            "/timer/" +
            groupID +
            "/" +
            activeDay +
            "/" +
            task.type +
            "/" +
            taskindex
          }
        >
          <IonButton fill="clear" expand={"full"}></IonButton>
          <IonIcon slot="start" icon={done ? icon_done : playOutline} />
          {task.desc}
        </IonItem>
      );
    }
  });

  return (
    <>
      <IonList lines="full">
        <IonListHeader>
          <h4>Your path's activities</h4>
        </IonListHeader>
        <IonItemGroup>{tasks}</IonItemGroup>
      </IonList>

      {optional ? (
        <IonList>
          <IonListHeader>
            <h4>Optional activities</h4>
          </IonListHeader>
          <IonItemGroup>{optional}</IonItemGroup>
        </IonList>
      ) : (
        ""
      )}
    </>
  );
}

export default TodoTasks;
