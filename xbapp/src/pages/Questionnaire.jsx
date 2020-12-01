import React, { useState, useEffect } from 'react';
import {
  IonItem,
  IonListHeader, IonContent, IonLabel, IonRadio, IonRadioGroup, IonPage, IonHeader, IonToolbar, IonTitle,
  IonItemDivider, IonButton
} from '@ionic/react';
import { connect } from 'react-redux'

const Questionnaire = (account) => {
  const [selectedHowFeel, setSelectedHowFeel] = useState();
  const [selectedExposure, setSelectedExposure] = useState();
  const [selectedAlarm, setSelectedAlarm] = useState();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Questionnaire</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRadioGroup value={selectedHowFeel} onIonChange={e => setSelectedHowFeel(e.detail.value)}>
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
        <IonItemDivider>You are feeling {selectedHowFeel ?? '?'} than the previous day.</IonItemDivider>

        <IonRadioGroup value={selectedExposure} onIonChange={e => setSelectedExposure(e.detail.value)}>
          <IonListHeader>
            <IonLabel>Did you get sunlight exposure for this day?</IonLabel>
          </IonListHeader>

          <IonItem>
            <IonLabel>Yes</IonLabel>
            <IonRadio slot="start" value="did" />
          </IonItem>

          <IonItem>
            <IonLabel>No</IonLabel>
            <IonRadio slot="start" value="didn't" />
          </IonItem>
        </IonRadioGroup>
        <IonItemDivider>You {selectedExposure ?? '?'} get sunlight exposure for this day.</IonItemDivider>

        <IonRadioGroup value={selectedAlarm} onIonChange={e => setSelectedAlarm(e.detail.value)}>
          <IonListHeader>
            <IonLabel>Did you wake up with an alarm on this day?</IonLabel>
          </IonListHeader>

          <IonItem>
            <IonLabel>Yes</IonLabel>
            <IonRadio slot="start" value="did" />
          </IonItem>

          <IonItem>
            <IonLabel>No</IonLabel>
            <IonRadio slot="start" value="didn't" />
          </IonItem>

        </IonRadioGroup>
        <IonItemDivider>You {selectedAlarm ?? '?'} wake up with an alarm on this day.</IonItemDivider>
        <IonButton >
              Submit
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

// Return the component, wrapped up so that it connects to the global state from Redux
export default connect(
  (state, ownProps) => {
    // A function to map parts of the global state (from the App's wrapper <Provider>)
    // into props for the wrapped component (which will be TabAccount)
    return {
      account: state.account
    }
  },
  {
    // A map full of action creators
  }

)(Questionnaire);
