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
} from "ionicons/icons";

import { triggerLockRecomputation } from "../../slice";

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

const conversions = {
  hours: 60 * 60,
  minutes: 60,
  seconds: 1,
};

const msToDHMS = function (ms) {
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
  remainingTime,
  ...props
}) {
  const { moduleId } = useParams();

  const [localRemainingTime, setLocalRemainingTime] = React.useState(
    remainingTime
  );

  const callbackRef = React.useRef();
  const intervalIdRef = React.useRef();

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!localRemainingTime) {
      return;
    }

    callbackRef.current = () => {
      const newTime = localRemainingTime - 1000;
      if (newTime <= 0) {
        dispatch(triggerLockRecomputation(moduleId));
        console.log("Countdown reaches 0, clearing interval");
        clearInterval(intervalIdRef.current);
      }

      setLocalRemainingTime(newTime);
    };
  }, [localRemainingTime]);

  React.useEffect(() => {
    if (!remainingTime || remainingTime <= 0) {
      return;
    }

    setLocalRemainingTime(remainingTime);

    const intervalId = (intervalIdRef.current = setInterval(() => {
      callbackRef.current?.();
    }, 1000));

    return () => {
      console.log("remainingTime changes, clearing interval");
      clearInterval(intervalId);
    };
  }, [remainingTime]);

  let formattedTime = null;
  if (localRemainingTime && localRemainingTime > 0) {
    const converted = msToDHMS(localRemainingTime);
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
      <IonLabel>
        {name} {formattedTime}
      </IonLabel>
    </IonItem>
  );
};

export default TaskListItem;
