import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IonItem, IonIcon, IonLabel } from "@ionic/react";
import {
  schoolOutline,
  journalOutline,
  checkmarkOutline,
  lockClosedOutline,
  pencilOutline,
  scaleOutline,
  flaskOutline,
} from "ionicons/icons";

import { invalidateLocks } from "../../slice";

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

  if (icon === "EXPERIMENT") {
    return flaskOutline;
  }
}

const msToDHMS = function (ms) {
  const conversions = {
    hours: 60 * 60,
    minutes: 60,
    seconds: 1,
  };

  const result = {};

  let delta = ms / 1000;
  Object.keys(conversions).forEach(function (key) {
    result[key] = Math.floor(delta / conversions[key]);

    if (result[key] < 10) {
      result[key] = `0${result[key]}`;
    } else {
      result[key] = result[key].toString();
    }

    delta -= result[key] * conversions[key];
  });

  return result;
};

const TaskListItem = function ({
  icon,
  name,
  status,
  disabled,
  lockedUntil,
  ...props
}) {
  const { moduleId } = useParams();

  const [remainingTime, setRemainingTime] = React.useState(
    lockedUntil ? lockedUntil - Date.now() : null
  );

  const dispatch = useDispatch();

  // Set interval whenever lockedUntil prop changes

  React.useEffect(() => {
    // If there isn't a ts to lock until, or it's already in the past, do nothing

    if (!lockedUntil || lockedUntil - Date.now() <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      const newRemainingTime = lockedUntil - Date.now();
      if (newRemainingTime <= 0) {
        dispatch(invalidateLocks(moduleId));
        console.log("Countdown reaches 0, clearing interval");
        clearInterval(intervalId);
      }

      setRemainingTime(newRemainingTime);
    }, 1000);

    return () => {
      console.log("lockedUntil changes, clearing interval");
      clearInterval(intervalId);
    };
  }, [lockedUntil]);

  let formattedTime = null;
  if (remainingTime && remainingTime > 0) {
    const converted = msToDHMS(remainingTime);
    formattedTime =
      converted.hours + ":" + converted.minutes + ":" + converted.seconds;
  }

  return (
    <IonItem lines="none" disabled={status === "LOCKED" || disabled} {...props}>
      <IonIcon
        slot="start"
        color={status === "COMPLETED" ? "success" : undefined}
        icon={getTaskIcon(status, icon)}
      />
      <IonLabel>{formattedTime || name}</IonLabel>
    </IonItem>
  );
};

export default TaskListItem;
