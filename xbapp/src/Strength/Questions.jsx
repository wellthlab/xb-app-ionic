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
} from "@ionic/react";
import { arrowForwardOutline } from "ionicons/icons";

function Question({ label, type, setValue, readOnly }) {
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
            readonly={readOnly}
          ></IonInput>
        </IonItem>
      </IonCol>
    </>
  );
}

/**
 *  Contextual questions about where the user is exercising, etc. Set in a 2-column grid.
 *  onSubmit: the callback that receives a response from the widget(s)
 */
function ContextualQuestions({ onSubmit }) {
  let [location, setLocation] = useState(undefined);
  let [time, setTime] = useState(undefined);
  let [whoWith, setWhoWith] = useState(undefined);
  let [atHome, setAtHome] = useState(undefined);
  let [readOnly, setReadOnly] = useState(false);

  let buttonClickable = location || time || whoWith || atHome; // if any of the fields are filled, the button is clickable

  // add the inputs to the onSubmit callback and set input to readonly
  function saveResponses() {
    onSubmit({
      type: "contextualQuestions",
      location: location,
      timeOfDay: time,
      whoWith: whoWith,
      atHome: atHome,
    });
    setReadOnly(true);
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
                <Question
                  label="Where are you?"
                  type="text"
                  placeholder="home"
                  setValue={setLocation}
                  readOnly={readOnly}
                />
              </IonCol>
              <IonCol>
                <Question
                  label="What time is it?"
                  type="text"
                  setValue={setTime}
                  readOnly={readOnly}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <Question
                  label="Are you at home, or work?"
                  type="text"
                  setValue={setAtHome}
                  readOnly={readOnly}
                />
              </IonCol>
              <IonCol>
                <Question
                  label="Are you moving alone?"
                  type="text"
                  setValue={setWhoWith}
                  readOnly={readOnly}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
        <div className="row" style={{ textAlign: "center" }}>
          <IonButton
            expand="block"
            onClick={saveResponses}
            disabled={!buttonClickable || readOnly} // button only clickable if a field is filled, or if answers not submitted
          >
            Save Responses <IonIcon icon={arrowForwardOutline} />
          </IonButton>
        </div>
      </IonCard>
    </>
  );
}

export default ContextualQuestions;
