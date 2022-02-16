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
function QuestionText({ label, type, setValue, disabled }) {
  return (
    <>
      <IonRow>
        <IonCol>
          <IonItem>
            <IonLabel position="floating">{label}</IonLabel>
            <IonInput
              type={type}
              onIonChange={(e) => {
                setValue(e.detail.value);
              }}
              disabled={disabled}
            ></IonInput>
          </IonItem>
        </IonCol>
      </IonRow>
    </>
  );
}

// Choice question, with a dropdown
function QuestionChoice({ label, choices, value, setValue, disabled }) {
  let selections = choices.map((choice) => {
    return <IonSelectOption value={choice}>{choice}</IonSelectOption>;
  });

  return (
    <>
      <IonRow>
        <IonCol>
          <IonItem>
            <IonLabel position="floating">{label}</IonLabel>
            <IonSelect
              multiple={false}
              value={value}
              onIonChange={(e) => {
                setValue(e.detail.value);
              }}
              disabled={disabled}
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
  let [inputDisabled, setInputDisabled] = useState(false);

  // if any of the fields are filled, the button is clickable
  let buttonClickable =
    location || whoWith || atHomeOrWork || timeOfDay || indoorsOrOutdoors;

  // add the inputs to the onSubmit callback and set input to readonly
  function saveResponses() {
    onSubmit({
      type: "contextualQuestions",
      location: location,
      whoWith: whoWith,
      atHome: atHomeOrWork,
    });
    // button is unclickable after submission, to avoid multiple re-submissions messing things up
    // TOOD: double-check if I need to do this
    setInputDisabled(true);
  }

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
              label={"Are you at home, or work?"}
              choices={["Home", "Work"]}
              value={atHomeOrWork}
              setValue={setAtHomeOrWork}
              disabled={inputDisabled}
            />
            <QuestionChoice
              label={"Indoors or outdoors?"}
              choices={["Indoors", "Outdoors"]}
              value={indoorsOrOutdoors}
              setValue={setIndoorsOrOutdoors}
              disabled={inputDisabled}
            />
            <QuestionText
              label="Where are you, i.e. office or living room?"
              type="text"
              placeholder="home"
              setValue={setLocation}
              disabled={inputDisabled}
            />
            <QuestionChoice
              label={"What time of day is it?"}
              choices={["Morning", "Afternoon", "Evening"]}
              value={timeOfDay}
              setValue={setTimeOfDay}
              disabled={inputDisabled}
            />
            <QuestionChoice
              label="Alone, or with others?"
              choices={["Alone", "With others"]}
              value={whoWith}
              setValue={setWhoWith}
              disabled={inputDisabled}
            />
          </IonList>
        </IonCardContent>
        <div className="row" style={{ textAlign: "center" }}>
          <IonButton
            expand="full"
            onClick={saveResponses}
            disabled={!buttonClickable || inputDisabled} // button only clickable if a field is filled, or if answers not submitted
          >
            Save Responses <IonIcon icon={arrowForwardOutline} />
          </IonButton>
        </div>
      </IonCard>
    </>
  );
}

export default ContextualQuestions;
