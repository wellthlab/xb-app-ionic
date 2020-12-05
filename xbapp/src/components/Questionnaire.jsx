import React, { useState, useEffect } from 'react';
import {
  IonItem,
  IonListHeader, IonContent, IonLabel, IonRadio, IonRadioGroup, IonPage, IonHeader, IonToolbar, IonTitle,
  IonItemDivider, IonButton
} from '@ionic/react';
import { connect } from 'react-redux'


const Questionnaire = (props)  => {
  const [selectedHowFeel, setSelectedHowFeel] = useState({mood: ""});
  const [selectedExposure, setSelectedExposure] = useState({exposure: ""});
  const [selectedAlarm, setSelectedAlarm] = useState({alarm: ""});

  function processData(){
    var moodValue = 0;

    //important: these are numbers as they will be represented on the graph
    //and because they are dependent on the previous day, we are going to use a weighted average to be able to draw the points
    //the limits for this will always be between -2 and 2
    if (selectedHowFeel.mood = "a lot worse"){
      moodValue = -2;
    } else if (selectedHowFeel.mood = "worse"){
      moodValue = -1;
    } else if (selectedHowFeel.mood = "the same"){
      moodValue = 0;
    } else if (selectedHowFeel.mood = "better"){
      moodValue = 1;
    } else if (selectedHowFeel.mood = "a lot better"){
      moodValue = 2;
    }

    var objectToAdd = {mood: moodValue, sunlight: selectedExposure.exposure, alarm: selectedAlarm.alarm}

    if(props.onSubmit) {
        props.onSubmit(objectToAdd);
    }
  }

  return (
      <>
        <IonRadioGroup value={selectedHowFeel.mood} onIonChange={e => setSelectedHowFeel({mood: e.detail.value})}>
          <IonListHeader>
            <IonLabel>How do you feel compared to the previous day?</IonLabel>
          </IonListHeader>

          <IonItem>
            <IonLabel>A lot worse</IonLabel>
            <IonRadio slot="start" value="a lot worse" />
          </IonItem>

          <IonItem>
            <IonLabel>Worse</IonLabel>
            <IonRadio slot="start" value="worse" />
          </IonItem>

          <IonItem>
            <IonLabel>The same</IonLabel>
            <IonRadio slot="start" value="the same" />
          </IonItem>
          <IonItem>
            <IonLabel>Better</IonLabel>
            <IonRadio slot="start" value="better" />
          </IonItem>
          <IonItem>
            <IonLabel>A lot better</IonLabel>
            <IonRadio slot="start" value="a lot better" />
          </IonItem>
        </IonRadioGroup>
        <IonItemDivider></IonItemDivider>

        <IonRadioGroup value={selectedExposure.exposure} onIonChange={e => setSelectedExposure({exposure: e.detail.value})}>
          <IonListHeader>
            <IonLabel>Did you get sunlight exposure for this day?</IonLabel>
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

        <IonRadioGroup value={selectedAlarm.alarm} onIonChange={e => setSelectedAlarm({alarm: e.detail.value})}>
          <IonListHeader>
            <IonLabel>Did you wake up with an alarm on this day?</IonLabel>
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
        <IonButton onClick={() => {processData()}}>
              Submit
        </IonButton>
        </>
  );
};

export default Questionnaire;
