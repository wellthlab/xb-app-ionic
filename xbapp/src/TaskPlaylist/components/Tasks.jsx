import {
  IonList,
  IonItem,
  IonItemGroup,
  IonIcon,
  IonButton,
  IonListHeader,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
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
  let dayIndexResponses = activeDay === 0 ? 0 : activeDay - 1;
  let tasksDone = props.team.entries[dayIndexResponses].responseTypes;

  // Create a group of tasks using Array.map
  function createTasksGroup(taskArr, taskSection, optional) {
    let tasks = taskArr.map((task, taskIndex) => {
      let done = task.type in tasksDone;
      let optionalOrRequired = optional ? "optional" : "required";
      let colour = optional ? "secondary" : "primary";
      if (
        task.onPlaylist &&
        (task.s22onPath === "all" || task.s22onPath === props.team.s22path.path)
      ) {
        return (
          <IonItem
            color={done ? "" : colour}
            key={taskIndex}
            routerLink={
              "/timer/" +
              optionalOrRequired +
              "/" +
              groupID +
              "/" +
              activeDay +
              "/" +
              task.type +
              "/" +
              taskSection +
              "/" +
              task.intype +
              "/" +
              taskIndex
            }
          >
            <IonButton fill="clear" expand={"full"} />
            <IonIcon slot="start" icon={done ? icon_done : playOutline} />
            {task.desc}
          </IonItem>
        );
      } else {
        return null;
      }
    });

    return tasks;
  }

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
        <h3>There are no timed tasks for today</h3>
      </div>
    );
  }

  // First create the task groups

  const introTasks = createTasksGroup(
    requiredTasks["introTasks"],
    "introTasks",
    false
  );
  const moduleTasks = createTasksGroup(
    requiredTasks["moduleTasks"],
    "moduleTasks",
    false
  );
  const exitTasks = createTasksGroup(
    requiredTasks["exitTasks"],
    "exitTasks",
    false
  );
  const optional = createTasksGroup(optionalTasks, "undefined", true);

  // Then filter out any null items, which are not tasks to be shown on the
  // playlist. This is done because we conditionally render the tasks to display
  // to avoid weird blank space

  const introTasksFiltered = introTasks.filter((el) => el !== null);
  const moduleTasksFiltered = moduleTasks.filter((el) => el !== null);
  const exitTasksFiltered = exitTasks.filter((el) => el !== null);
  const optionalFiltered = optional.filter((el) => el !== null);

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Your path's activities</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {/* Intro tasks -- maybe sometimes wont have these */}
          {introTasksFiltered.length > 0 ? (
            <IonList lines="full">
              <IonItemGroup>{introTasksFiltered}</IonItemGroup>
            </IonList>
          ) : (
            ""
          )}
          {/* Module tasks -- there always will be these*/}
          <IonList lines="full">
            <IonItemGroup>{moduleTasksFiltered}</IonItemGroup>
          </IonList>
          {/* Exit tasks -- maybe sometimes wont have these*/}
          {exitTasksFiltered.length > 0 ? (
            <IonList lines="full">
              <IonItemGroup>{exitTasksFiltered}</IonItemGroup>
            </IonList>
          ) : (
            ""
          )}
        </IonCardContent>
      </IonCard>

      {/* Optional tasks */}
      {optionalFiltered.length > 0 ? (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Optional activities</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItemGroup>{optionalFiltered}</IonItemGroup>
            </IonList>
          </IonCardContent>
        </IonCard>
      ) : (
        ""
      )}
    </>
  );
}

export default TodoTasks;
