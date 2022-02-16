import { useState } from "react";
import {
  IonCard,
  IonInput,
  IonButton,
  IonGrid,
  IonList,
  IonRow,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonCardContent,
  IonLabel,
  IonCol,
  IonCardSubtitle,
  IonCardHeader,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { arrowForwardOutline } from "ionicons/icons";

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
                setValue(e.detail.value);
                onSubmit((response[resLabel] = e.detail.value));
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
                setValue(e.detail.value);
                onSubmit((response[resLabel] = e.detail.value));
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
            Answering these will help us understand how you are choosing to move
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
              question={"Are you at home, or work?"}
              choices={["Home", "Work"]}
              value={atHomeOrWork}
              setValue={setAtHomeOrWork}
              resLabel={"atHomeOrWork"}
              onSubmit={onSubmit}
            />
            <QuestionChoice
              question={"Indoors or outdoors?"}
              choices={["Indoors", "Outdoors"]}
              value={indoorsOrOutdoors}
              setValue={setIndoorsOrOutdoors}
              resLabel={"indoorsOrOutdoors"}
              onSubmit={onSubmit}
            />
            <QuestionText
              question="Where are you, i.e. office or living room?"
              type="text"
              value={location}
              setValue={setLocation}
              resLabel={"location"}
              onSubmit={onSubmit}
            />
            <QuestionChoice
              question={"What time of day is it?"}
              choices={["Morning", "Afternoon", "Evening"]}
              value={timeOfDay}
              setValue={setTimeOfDay}
              resLabel={"timeOfDay"}
              onSubmit={onSubmit}
            />
            <QuestionChoice
              question="Alone, or with others?"
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
