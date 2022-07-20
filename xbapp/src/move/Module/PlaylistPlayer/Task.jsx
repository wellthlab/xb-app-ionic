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
import { selectPlaylists, selectResponse } from "../../slice";

const SelfAssessmentTaskContent = function ({ checked, onIonChange }) {
  return (
    <IonItem lines="none">
      <IonCheckbox slot="start" checked={checked} onIonChange={onIonChange} />
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

const Task = function ({ taskIndex, onTaskChange, disableNavigation }) {
  const { moduleId, playlistIndex, enrollmentIndex } = useParams();

  const playlist = useSelector(
    (state) => selectPlaylists(state, moduleId, enrollmentIndex)[playlistIndex]
  );

  const response = useSelector((state) =>
    selectResponse(state, moduleId, enrollmentIndex, taskIndex)
  );

  const task = playlist.tasks[taskIndex];

  console.log(task);

  const [values, setValues] = React.useState(
    response && response.payload ? response.payload : createInitialValues(task)
  );

  const createChangeHandler = function (name, handler) {
    return (e) => {
      setValues({ ...values, [name]: handler(e) });
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
              onIonChange={createChangeHandler(
                "checked",
                (e) => e.detail.checked
              )}
            />
          )}
          {task.type !== "INPUT"
            ? null
            : task.inputs.map(({ label, optional }) => (
                <IonItem key={label}>
                  <IonLabel position="floating">
                    {label} {!optional ? "*" : null}
                  </IonLabel>
                  <IonInput
                    value={values[label]}
                    onIonChange={createChangeHandler(
                      label,
                      (e) => e.detail.value
                    )}
                  />
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
              disabled={disableNavigation || !taskIndex}
            />
          </IonCol>
          <IonCol>
            <NavigationButton
              dir={1}
              expand="block"
              onClick={createTaskChangeHandler(1)}
              disabled={disableNavigation}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
    </React.Fragment>
  );
};

export default Task;
