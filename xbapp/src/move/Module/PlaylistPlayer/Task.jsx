import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
} from "@ionic/react";

import NavigationButton from "../../components/NavigationButton";
import { selectModuleById } from "../../slice";

const SelfAssessmentTaskContent = function ({ checked, onChange }) {
  return (
    <IonItem lines="none">
      <IonCheckbox
        slot="start"
        checked={checked}
        onChange={(e) => onChange(e.details.checked)}
      />
      <IonLabel>I have done/read the instructions for this task</IonLabel>
    </IonItem>
  );
};

const createInitialValues = function (task) {
  if (task.type === "INPUT") {
    const values = {};
    for (const definition of task.inputs) {
      values[definition.label] = null;
    }

    return values;
  }

  if (task.type === "SELF_ASSESSMENT") {
    return { checked: false };
  }
};

const Task = function ({ taskId, response, onTaskChange, disableNavigation }) {
  const { moduleId, playlistId } = useParams();

  const { playlists } = useSelector((state) =>
    selectModuleById(state, moduleId)
  );

  const tasks = playlists[playlistId].tasks;
  const task = tasks[taskId];

  console.log(task);

  const [values, setValues] = React.useState(
    response && response.payload ? response.payload : createInitialValues(task)
  );

  const createChangeHandler = function (name) {
    return (value) => {
      setValues({ ...values, [name]: value });
    };
  };

  const createTaskChangeHandler = function (dir) {
    return () => {
      onTaskChange(dir, values);
    };
  };

  return (
    <React.Fragment>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{task.name}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {task.desc ? <p>{task.desc}</p> : null}
          {task.type !== "SELF_ASSESSMENT" ? null : (
            <SelfAssessmentTaskContent
              checked={values.checked}
              onChange={createChangeHandler("checked")}
            />
          )}
          {task.type !== "INPUT"
            ? null
            : task.inputs.map(({ label }) => (
                <IonItem key={label}>
                  <IonLabel position="floating">{label}</IonLabel>
                  <IonInput value={values[label]}></IonInput>
                </IonItem>
              ))}
        </IonCardContent>
      </IonCard>
      <IonGrid>
        <IonRow>
          <IonCol>
            <NavigationButton
              dir={-1}
              expand="block"
              onClick={createTaskChangeHandler(-1)}
              disabled={disableNavigation || !taskId}
            />
          </IonCol>
          <IonCol>
            <NavigationButton
              dir={1}
              expand="block"
              onClick={createTaskChangeHandler(1)}
              disabled={disableNavigation || taskId === tasks.length - 1}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
    </React.Fragment>
  );
};

export default Task;
