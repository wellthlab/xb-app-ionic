import React from "react";
import { IonCard, IonCardContent, IonText } from "@ionic/react";

const Task = function ({ task }) {
  return (
    <IonCard>
      <IonCardContent>
        <IonText color="dark">
          <span
            dangerouslySetInnerHTML={{
              __html: task.desc.replace(/\n/g, "<br>"),
            }}
          />
        </IonText>
      </IonCardContent>
    </IonCard>
  );
};

export default Task;
