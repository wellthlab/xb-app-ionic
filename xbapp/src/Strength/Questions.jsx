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

function Question({ label, type, setValue }) {
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
          ></IonInput>
        </IonItem>
      </IonCol>
    </>
  );
}

/**
 *  Contextual questions about where the user is exercising, etc.
 *  onSubmit: the callback that receives a response from the widget(s)
 */
function ContextualQuestions({ onSubmit }) {
  let [location, setLocation] = useState("");
  let [time, setTime] = useState("");
  let [whoWith, setWhoWith] = useState("");
  let [atHome, setAtHome] = useState("");

  function saveResponses() {
    onSubmit({
      location: location,
      timeOfDay: time,
      whoWith: whoWith,
      atHome: atHome,
    });
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
              <Question
                label="Where are you?"
                type="text"
                placeholder="home"
                setValue={setLocation}
              />
            </IonRow>
            <IonRow>
              <Question
                label="What time is it?"
                type="text"
                setValue={setTime}
              />
            </IonRow>
            <IonRow>
              <Question
                label="Are you at home, or work?"
                type="text"
                setValue={setAtHome}
              />
            </IonRow>
            <IonRow>
              <Question
                label="Are you moving alone?"
                type="text"
                setValue={setWhoWith}
              />
            </IonRow>
          </IonGrid>
        </IonCardContent>
        <div className="row" style={{ textAlign: "center" }}>
          <IonButton onClick={saveResponses}>
            Save Responses <IonIcon icon={arrowForwardOutline} />
          </IonButton>
        </div>
      </IonCard>
    </>
  );
}

export default ContextualQuestions;
