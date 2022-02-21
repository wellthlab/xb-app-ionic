import { useState } from "react";
import {
  IonCard,
  IonInput,
  IonList,
  IonRow,
  IonCardTitle,
  IonItem,
  IonCardContent,
  IonLabel,
  IonCol,
  IonCardSubtitle,
  IonCardHeader,
  IonSelect,
  IonText,
  IonSelectOption,
} from "@ionic/react";

// Free-form text input
function QuestionText({ question, type, value, setValue, resLabel, onSubmit }) {
  var response = {};
  return (
    <>
      <IonRow>
        <IonCol>
          <IonItem>
            <IonLabel position="floating">{question}</IonLabel>
            <IonInput
              value={value}
              type={type}
              onIonChange={(e) => {
                response[resLabel] = e.detail.value;
                setValue(e.detail.value);
                onSubmit(response);
              }}
            ></IonInput>
          </IonItem>
        </IonCol>
      </IonRow>
    </>
  );
}

// Choice question, with a dropdown
function QuestionChoice({
  question,
  choices,
  value,
  setValue,
  resLabel,
  onSubmit,
}) {
  let response = {};
  let selections = choices.map((choice) => {
    return <IonSelectOption value={choice}>{choice}</IonSelectOption>;
  });

  return (
    <>
      <IonRow>
        <IonCol>
          <IonItem>
            <IonLabel position="floating">{question}</IonLabel>
            <IonSelect
              multiple={false}
              value={value}
              onIonChange={(e) => {
                response[resLabel] = e.detail.value;
                setValue(e.detail.value);
                onSubmit(response);
              }}
            >
              {selections}
            </IonSelect>
          </IonItem>
        </IonCol>
      </IonRow>
    </>
  );
}

/**
 *  Contextual questions about where the user is exercising, etc. Set in a 2-column grid.
 *  onSubmit: the callback that receives a response from the widget(s)
 */
function ContextualQuestions({ onSubmit }) {
  let [atHomeOrWork, setAtHomeOrWork] = useState(undefined);
  let [somewhereElse, setSomewhereElse] = useState(undefined);
  let [location, setLocation] = useState(undefined);
  let [whoWith, setWhoWith] = useState(undefined);
  let [timeOfDay, setTimeOfDay] = useState(undefined);
  let [indoorsOrOutdoors, setIndoorsOrOutdoors] = useState(undefined);
  let [workDay, setWorkDay] = useState(undefined);

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>How are you moving?</IonCardTitle>
          <IonCardSubtitle>
            These <IonText color={"tertiary"}>optional</IonText> questions will
            help us understand how you are choosing to move
          </IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent>
          <IonList>
            <QuestionChoice
              question={"Is today a work day?"}
              choices={["Yes", "No"]}
              value={workDay}
              setValue={setWorkDay}
              resLabel={"workDay"}
              onSubmit={onSubmit}
            />
            <QuestionChoice
              question={"Are you at home, work, or somewhere where else?"}
              choices={["Home", "Work", "Somewhere else"]}
              value={atHomeOrWork}
              setValue={setAtHomeOrWork}
              resLabel={"atHomeOrWork"}
              onSubmit={onSubmit}
            />
            {atHomeOrWork === "Somewhere else" ? (
              <QuestionText
                question={"Where is somewhere else?"}
                value={somewhereElse}
                setValue={setSomewhereElse}
                resLabel={"somewhereElse"}
                onSubmit={onSubmit}
              />
            ) : (
              ""
            )}
            <QuestionChoice
              question={"Indoors or outdoors?"}
              choices={["Indoors", "Outdoors"]}
              value={indoorsOrOutdoors}
              setValue={setIndoorsOrOutdoors}
              resLabel={"indoorsOrOutdoors"}
              onSubmit={onSubmit}
            />
            <QuestionText
              question="Where are you, e.g. office?"
              type="text"
              value={location}
              setValue={setLocation}
              resLabel={"location"}
              onSubmit={onSubmit}
            />
            <QuestionChoice
              question={"What time of day is it?"}
              choices={["Morning", "Midday", "Afternoon", "Evening"]}
              value={timeOfDay}
              setValue={setTimeOfDay}
              resLabel={"timeOfDay"}
              onSubmit={onSubmit}
            />
            <QuestionChoice
              question="Moving alone, or with others?"
              choices={["Alone", "With others"]}
              value={whoWith}
              setValue={setWhoWith}
              resLabel={"whoWith"}
              onSubmit={onSubmit}
            />
          </IonList>
        </IonCardContent>
      </IonCard>
    </>
  );
}

export default ContextualQuestions;
