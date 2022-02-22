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
  let responses = props.team.entries[dayIndexResponses].responses;

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

  // Required tasks for the users' path
  const tasks = requiredTasks.map((task, taskIndex) => {
    // TODO: this won't scale very well when there are lots of responses, but for now it's good enough.
    // TODO: on response add, update the model with tasks complete look up
    let done = null;
    let checkIndex = null;
    for (let i = 0; i < responses.length; i++) {
      checkIndex = parseInt(responses[i].taskIndex);
      let requiredTask = responses[i].requiredTask;
      done = checkIndex === taskIndex && requiredTask === true ? true : false;
      if (done) {
        break;
      }
    }

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
            taskIndex
          }
        >
          <IonButton fill="clear" expand={"full"}></IonButton>
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
    let done = null;
    let checkIndex = null;
    for (let i = 0; i < responses.length; i++) {
      checkIndex = parseInt(responses[i].taskIndex);
      let requiredTask = responses[i].requiredTask;
      done = checkIndex === taskIndex && requiredTask === false ? true : false;
      if (done) {
        break;
      }
    }
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
            taskIndex
          }
        >
          <IonButton fill="clear" expand={"full"}></IonButton>
          <IonIcon slot="start" icon={done ? icon_done : playOutline} />
          {task.desc}
        </IonItem>
      );
    } else {
      return <></>;
    }
  });

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
            <IonItemGroup>{tasks}</IonItemGroup>
          </IonList>
        </IonCardContent>
      </IonCard>

      {optional ? (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Optional activities</IonCardTitle>
            <IonCardSubtitle>
              You can do these in any order you like
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItemGroup>{optional}</IonItemGroup>
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
