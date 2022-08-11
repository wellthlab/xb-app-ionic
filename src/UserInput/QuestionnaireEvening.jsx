import React, { useState, useEffect } from "react";
import {
  IonItem,
  IonListHeader,
  IonTextarea,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonPage,
  IonHeader,
  IonRange,
  IonItemDivider,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";

const FeltScale = {
  0: "(0) Not at all",
  1: "(1)",
  2: "(2)",
  3: "(3)",
  4: "(4)",
  5: "(5) So and so",
  6: "(6)",
  7: "(7)",
  8: "(8)",
  9: "(9)",
  10: "(10) A lot",
};

const QuestionnaireEvening = (props) => {
  const [value, setValue] = useState(5);

  const response = {};

  function SliderQuestion({ statement, resKey }) {
    let [value, setValue] = useState(response[resKey] ? response[resKey] : 0);

    return (
      <>
        <IonRow>
          <IonCol>
            <IonItem>{statement}</IonItem>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonItem style={{ textAlign: "center" }}>
              <IonLabel>{FeltScale[value]}</IonLabel>
            </IonItem>
            <IonItem>
              <IonRange
                min={0}
                max={10}
                step={1}
                snaps={true}
                ticks={true}
                color="secondary"
                value={value}
                onIonChange={(e) => {
                  setValue(e.detail.value);
                  response[resKey] = e.detail.value;
                }}
              />
            </IonItem>
          </IonCol>
        </IonRow>
      </>
    );
  }

  // function onChangeSlider(valueToUpdate) {
  //   setValue(valueToUpdate);
  // }

  function processData() {
    console.log("response", response);

    // var response = {};
    // response.type = "questionnaire-endWeek";
    // response.felt = value;

    // if (props.onSubmit) {
    //   props.onSubmit(response);
    // }
  }

  console.log("response", response);

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            Rate the following on a scale from 0 to 10
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <SliderQuestion
              statement={"In general, I felt good today"}
              resKey={"feltGoodToday"}
            />
          </IonGrid>

          <IonButton
            expand="full"
            onClick={() => {
              processData();
            }}
          >
            Submit
          </IonButton>
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default QuestionnaireEvening;
