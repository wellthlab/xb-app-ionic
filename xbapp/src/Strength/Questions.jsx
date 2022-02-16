import { useState } from "react";
import {
  IonCard,
  IonInput,
  IonButton,
  IonGrid,
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

function QuestionText({ label, type, setValue, disabled }) {
  return (
    <>
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
    </>
  );
}

function QuestionChoice({ label, choices, value, setValue, disabled }) {
  let selections = choices.map((choice) => {
    return <IonSelectOption value={choice}>{choice}</IonSelectOption>;
  });

  return (
    <>
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
  let [inputDisabled, setInputDisabled] = useState(false);

  let buttonClickable = location || whoWith || atHomeOrWork; // if any of the fields are filled, the button is clickable

  // add the inputs to the onSubmit callback and set input to readonly
  function saveResponses() {
    onSubmit({
      type: "contextualQuestions",
      location: location,
      whoWith: whoWith,
      atHome: atHomeOrWork,
    });
    setInputDisabled(true);
  }

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>How are you moving?</IonCardTitle>
          <IonCardSubtitle>
            Answering these will help us understand how you are moving
          </IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol>
                <QuestionChoice
                  label={"Are you at home, or work?"}
                  choices={["Home", "Work"]}
                  value={atHomeOrWork}
                  setValue={setAtHomeOrWork}
                  disabled={inputDisabled}
                ></QuestionChoice>
              </IonCol>
              <IonCol>
                <QuestionChoice
                  label="Are you moving alone, or with others?"
                  choices={["Alone", "With others"]}
                  value={whoWith}
                  setValue={setWhoWith}
                  disabled={inputDisabled}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <QuestionText
                  label="Where are you, i.e. office or living room?"
                  type="text"
                  placeholder="home"
                  setValue={setLocation}
                  disabled={inputDisabled}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
        <div className="row" style={{ textAlign: "center" }}>
          <IonButton
            expand="block"
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
