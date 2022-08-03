import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";

import Video from "./Video";
import SelfAssessmentInput from "./SelfAssessmentInput";
import HeartRateInput from "./HeartRateInput";
import SelectInput from "./SelectInput";
import SliderInput from "./SliderInput";
import NumberInput from "./components/NumberInput";
import TextInput from "./components/TextInput";
import NavigationButton from "../../components/NavigationButton";
import { selectPlaylists, selectResponse } from "../../../slice";

const inputsMap = {
  heartrate: HeartRateInput,
  text: TextInput,
  number: NumberInput,
  select: SelectInput,
  slider: SliderInput,
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
  const { moduleId, playlistIndex } = useParams();

  const playlists = useSelector((state) => selectPlaylists(state, moduleId));
  const playlist = playlists[playlistIndex];

  const response = useSelector((state) =>
    selectResponse(state, moduleId, playlistIndex, taskIndex)
  );

  const task = playlist.tasks[taskIndex];

  console.log(task);

  const [values, setValues] = React.useState(
    response && response.payload ? response.payload : createInitialValues(task)
  );

  const createChangeHandler = function (name, handler) {
    return (e) => {
      setValues({ ...values, [name]: handler ? handler(e) : e });
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
        {task.video ? <Video src={task.video} /> : null}
        <IonCardContent>
          {task.desc ? <p>{task.desc}</p> : null}
          {task.type !== "SELF_ASSESSMENT" ? null : (
            <SelfAssessmentInput
              value={values.checked}
              onIonChange={createChangeHandler("checked")}
            />
          )}
          {task.type !== "INPUT"
            ? null
            : task.inputs.map(
                ({ label, optional, type, options, range, step }) => {
                  const Input = inputsMap[type];
                  return (
                    <Input
                      key={label}
                      label={label}
                      optional={optional}
                      value={values[label]}
                      options={options}
                      range={range}
                      step={step}
                      onIonChange={createChangeHandler(label)}
                    />
                  );
                }
              )}
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
