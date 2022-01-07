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

  function onChangeSlider(valueToUpdate) {
    setValue(valueToUpdate);
  }


  function processData() {
   
    var response = {};
    response.type = "questionnaire-endWeek";
    response.felt = value;


    if (props.onSubmit) {
      props.onSubmit(response);
    }
  }

  return (
    <>
      <div>
        <h4>Rate the following statement on the scale from 0 to 10:</h4>
        <h3>In general, I felt good today.</h3>
        <IonItemDivider></IonItemDivider>
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
          onIonChange={(e) => onChangeSlider(e.detail.value)}
        />
      </IonItem>

        <IonButton
          onClick={() => {
            processData();
          }}
        >
          Submit
        </IonButton>
      </div>
    </>
  );
};

export default QuestionnaireEvening;
