import React, { useState, useEffect } from "react";
import {
  IonItem,
  IonListHeader,
  IonContent,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonPage,
  IonHeader,
  IonRange,
  IonItemDivider,
  IonButton,
} from "@ionic/react";
import { connect } from "react-redux";
import MoodPicker from "./MoodPicker";

import "./Questionnaire.scss";

const Questionnaire = (props) => {
  const [selectedExposure, setSelectedExposure] = useState({ exposure: "" });
  const [selectedAlarm, setSelectedAlarm] = useState({ alarm: "" });
  const [moodValue, setMoodValue] = useState(3); //useStorage?;
  const [smileyVal, setSmileyVal] = useState(""); //useStorage?;

  function processData() {
    var officialMoodValue = 0;

    //important: these are numbers as they will be represented on the graph
    //and because they are dependent on the previous day, we are going to use a weighted average to be able to draw the points
    //the limits for this will always be between -2 and 2

    //the below is important for representing the graphs
    if (moodValue === 1) {
      officialMoodValue = -2;
    } else if (moodValue == 2) {
      officialMoodValue = -1;
    } else if (moodValue == 3) {
      officialMoodValue = 0;
    } else if (moodValue == 4) {
      officialMoodValue = 1;
    } else if (moodValue == 5) {
      officialMoodValue = 2;
    }

    //if needed to get value from smiley (text value):
    var smileyValue = smileyVal;

    var objectToAdd = {
      mood: officialMoodValue,
      sunlight: selectedExposure.exposure,
      alarm: selectedAlarm.alarm,
    };

    if (props.onSubmit) {
      props.onSubmit(objectToAdd);
    }
  }

  return (
    <>
      <div id="moodQuestions">
        <h4>How do you feel compared to yesterday?</h4>
        <MoodPicker
          onChange={async (moodVal, smileyVal) => {
            setMoodValue(moodVal);
            setSmileyVal(smileyVal);
          }}
          typeOfSlider="comparing"
        />
        <IonItemDivider></IonItemDivider>
        <IonRadioGroup
          allow-empty-selection="true"
          value={selectedExposure.exposure}
          onIonChange={(e) => setSelectedExposure({ exposure: e.detail.value })}
        >
          <IonListHeader>
            <IonLabel>Did you get sunlight exposure today?</IonLabel>
          </IonListHeader>

          <IonItem>
            <IonLabel>Yes</IonLabel>
            <IonRadio slot="start" value="sunlight" />
          </IonItem>

          <IonItem>
            <IonLabel>No</IonLabel>
            <IonRadio slot="start" value="no sunlight" />
          </IonItem>
        </IonRadioGroup>
        <IonItemDivider></IonItemDivider>

        <IonRadioGroup
          allow-empty-selection="true"
          value={selectedAlarm.alarm}
          onIonChange={(e) => setSelectedAlarm({ alarm: e.detail.value })}
        >
          <IonListHeader>
            <IonLabel>Did you wake up with an alarm today?</IonLabel>
          </IonListHeader>

          <IonItem>
            <IonLabel>Yes</IonLabel>
            <IonRadio slot="start" value="woke up with an alarm" />
          </IonItem>

          <IonItem>
            <IonLabel>No</IonLabel>
            <IonRadio slot="start" value="woke up with no alarm" />
          </IonItem>
        </IonRadioGroup>
        <IonItemDivider></IonItemDivider>
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

export default Questionnaire;
