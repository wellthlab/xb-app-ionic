import React from "react";
import {
  IonCard,
  IonCardContent,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";

import Video from "./Video";
import Timer from "./Timer";
import NavigationButton from "../components/NavigationButton";

const Task = function ({ task, response, onTaskChange, isFirst, isLast }) {
  const [minutes, setMinutes] = React.useState(response ? response.minutes : 0);
  const [timerStart, setTimerStart] = React.useState(false);

  const createTimerStateHandler = function (on) {
    return () => {
      setTimerStart(on);
    };
  };

  const createTaskChangeHandler = function (dir) {
    return () => {
      setTimerStart(false);

      const payload = {};

      if (task.timed) {
        payload.minutes = minutes;
      }

      onTaskChange(dir, payload);
    };
  };

  let content;
  let desc;

  if (task.desc) {
    desc = task.desc.replace(/\n/g, "<br>");
  }

  if (task.type === "VIDEO") {
    content = <Video src={task.video} />;
  }

  return (
    <React.Fragment>
      <IonCard>
        <IonCardContent>
          <IonText color="dark">
            {content && <div>{content}</div>}
            {desc && <span dangerouslySetInnerHTML={{ __html: desc }} />}
          </IonText>
        </IonCardContent>
      </IonCard>

      {task.timed && (
        <Timer
          start={timerStart}
          onStart={createTimerStateHandler(true)}
          onEnd={createTimerStateHandler(false)}
          onChange={setMinutes}
          value={minutes}
        />
      )}

      <IonGrid>
        <IonRow>
          <IonCol>
            <NavigationButton
              dir={-1}
              expand="block"
              onClick={createTaskChangeHandler(-1)}
              disabled={isFirst}
            />
          </IonCol>
          <IonCol>
            <NavigationButton
              dir={1}
              expand="block"
              onClick={createTaskChangeHandler(1)}
              disabled={isLast}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
    </React.Fragment>
  );
};

export default Task;
