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
  let responseTypes = props.team.entries[dayIndexResponses].responseTypes;

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

  // Required tasks for the users' path
  const required = requiredTasks.map((task, taskIndex) => {
    // check if task is done
    let done = task.type in responseTypes;
    // only include time tasks on the user's path
    if (
      task.timed &&
      (task.s22onPath === "all" || task.s22onPath === props.team.s22path.path)
    ) {
      return (
        <IonItem
          color={done ? "" : "primary"}
          key={taskIndex}
          routerLink={
            "/timer/required/" +
            groupID +
            "/" +
            activeDay +
            "/" +
            task.type +
            "/" +
            task.intype +
            "/" +
            taskIndex
          }
          disabled={done}
        >
          <IonButton fill="clear" expand={"full"} />
          <IonIcon slot="start" icon={done ? icon_done : playOutline} />
          {task.desc}
        </IonItem>
      );
    } else {
      return <></>;
    }
  });

  // Optional tasks for the users' path
  const optional = optionalTasks.map((task, taskIndex) => {
    // check if task is done
    let done = task.type in responseTypes;
    // only include tasks which are timed and are optional
    if (
      task.timed &&
      task.s22onPath !== false
      // && (task.s22onPath !== "all" || task.s22onPath !== props.team.s22path.path)
    ) {
      return (
        <IonItem
          color={done ? "" : "secondary"}
          key={taskIndex}
          routerLink={
            "/timer/optional/" +
            groupID +
            "/" +
            activeDay +
            "/" +
            task.type +
            "/" +
            task.intype +
            "/" +
            taskIndex
          }
          disabled={done}
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

  const requiredFiltered = required.filter((el) => el !== null);
  const optionalFiltered = optional.filter((el) => el !== null);

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Your path's activities</IonCardTitle>
          <IonCardSubtitle>
            You can do these in any order you like
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList lines="full">
            <IonItemGroup>{requiredFiltered}</IonItemGroup>
          </IonList>
        </IonCardContent>
      </IonCard>

      {optionalFiltered.length > 0 ? (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Optional activities</IonCardTitle>
            <IonCardSubtitle>
              You can do these in any order you like
            </IonCardSubtitle>
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
