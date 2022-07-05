import React from "react";
import { IonItem, IonIcon, IonLabel } from "@ionic/react";
import {
  barbellOutline,
  newspaperOutline,
  schoolOutline,
  stopwatchOutline,
  videocamOutline,
  flaskOutline,
  trailSignOutline,
  journalOutline,
  informationCircleOutline,
  checkmarkOutline,
  lockClosedOutline,
} from "ionicons/icons";
import dateFormat from "dateformat";

function getTaskIcon(verb) {
  switch (verb) {
    case "LEARN":
      return schoolOutline;
    case "MOVE":
      return barbellOutline;
    case "ANSWER":
      return newspaperOutline;
    case "WATCH":
      return videocamOutline;
    case "MEASURE":
      return stopwatchOutline;
    case "EXPERIMENT":
      return flaskOutline;
    case "FOLLOW":
      return trailSignOutline;
    case "JOURNAL":
      return journalOutline;
    default:
      return informationCircleOutline;
  }
}

const TaskListItem = function ({
  verb,
  status,
  name,
  disabled,
  constraint,
  ...props
}) {
  return (
    <IonItem lines="none" disabled={status === "locked" || disabled} {...props}>
      <IonIcon
        slot="start"
        color={status === "completed" ? "success" : undefined}
        icon={
          status === "incomplete"
            ? getTaskIcon(verb)
            : status === "locked"
            ? lockClosedOutline
            : checkmarkOutline
        }
      />
      <IonLabel>{name}</IonLabel>
      {!constraint ? null : (
        <IonLabel slot="end">
          {dateFormat(constraint.ms, "UTC:HH:MM:ss")}
        </IonLabel>
      )}
    </IonItem>
  );
};

export default TaskListItem;
