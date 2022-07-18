import React from "react";
import { IonItem, IonIcon, IonLabel } from "@ionic/react";
import {
  schoolOutline,
  journalOutline,
  checkmarkOutline,
  lockClosedOutline,
  pencilOutline,
  scaleOutline,
} from "ionicons/icons";
// import useCountDown from "react-countdown-hook";

function getTaskIcon(status, icon) {
  if (status === "COMPLETED") {
    return checkmarkOutline;
  }

  if (status === "LOCKED") {
    return lockClosedOutline;
  }

  if (status === "EDITING") {
    return pencilOutline;
  }

  if (icon === "ADVICE") {
    return schoolOutline;
  }
  if (icon === "QUESTIONNAIRE") {
    return journalOutline;
  }
  if (icon === "MEASURE") {
    return scaleOutline;
  }
}

const TaskListItem = function ({
  icon,
  name,
  status,
  disabled,
  constraint,
  ...props
}) {
  // const [timeLeft] = useCountDown(Date.now() + 1000 * 60 * 60);

  return (
    <IonItem lines="none" disabled={status === "LOCKED" || disabled} {...props}>
      <IonIcon
        slot="start"
        color={status === "COMPLETED" ? "success" : undefined}
        icon={getTaskIcon(status, icon)}
      />
      <IonLabel>{name}</IonLabel>
      {!constraint ? null : <IonLabel slot="end">Has constraint</IonLabel>}
    </IonItem>
  );
};

export default TaskListItem;
