import React from "react";
import { IonCard, IonCardContent, IonText } from "@ionic/react";

import Video from "./Video";

const Task = function ({ task }) {
  let content;
  let desc;

  if (task.desc) {
    desc = task.desc.replace(/\n/g, "<br>");
  }

  if (task.type === "VIDEO") {
    content = <Video src={task.video} />;
  }

  return (
    <IonCard>
      <IonCardContent>
        <IonText color="dark">
          {content && <div>{content}</div>}
          {desc && <span dangerouslySetInnerHTML={{ __html: desc }} />}
        </IonText>
      </IonCardContent>
    </IonCard>
  );
};

export default Task;
