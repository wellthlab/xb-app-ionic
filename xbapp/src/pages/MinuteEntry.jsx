import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonItem,
  IonInput, IonContent, IonGrid, IonRow, IonCol, IonPage, IonHeader, IonToolbar, IonTitle
} from '@ionic/react';
import './MinuteEntry.scss';
import { connect } from 'react-redux'
import Timer from '../components/Timer'

//we have the experiment/group ID, we have the day number to require update and we have the account
//=> can we update the day?
//need to handle the click of "submit" in both cases: when they use the timer or when they use an input field
const MinuteEntry = ({ match, teams })  => {
  const [number, setNumber] = useState();
  const [sunrise, setSunrise] = useState({ sourceSunrise: "assets/suns/sunrise1.png", sourceMidday: "assets/suns/midday1.png", sourceSunset: "assets/suns/sunset1.png" });
  const [environment, setEnvironment] = useState({ sourceIndoors: "assets/inout/indoors1.png", sourceOutdoors: "assets/inout/outdoors1.png" });

  var gid = match.params.id1; // Group ID comes from route
  var group = false;
  
  for (var g of teams.teams) { // Find the group in the store
    if (g._id == gid) {
      group = g;
    }
  }

  // console.log("Group info", group, props.teams.teams);

  function toggleImagesSun(imageToChange) {
    if (imageToChange == "sunrise") {
      setSunrise({ sourceSunrise: "assets/suns/sunrise2.png", sourceMidday: "assets/suns/midday1.png", sourceSunset: "assets/suns/sunset1.png" })
    } else if (imageToChange == "midday") {
      setSunrise({ sourceSunrise: "assets/suns/sunrise1.png", sourceMidday: "assets/suns/midday2.png", sourceSunset: "assets/suns/sunset1.png" })
    } else if (imageToChange == "sunset") {
      setSunrise({ sourceSunrise: "assets/suns/sunrise1.png", sourceMidday: "assets/suns/midday1.png", sourceSunset: "assets/suns/sunset2.png" })
    }
  }

  function toggleImagesInOut(imageToChange) {
    if (imageToChange == "indoors") {
      setEnvironment({ sourceIndoors: "assets/inout/indoors2.png", sourceOutdoors: "assets/inout/outdoors1.png" })
    } else if (imageToChange == "outdoors") {
      setEnvironment({ sourceIndoors: "assets/inout/indoors1.png", sourceOutdoors: "assets/inout/outdoors2.png" })
    }
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Experiment Proof</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="app">
          <div className="time">
            <div className="row">
              <p><b>Movement Minutes</b></p>
            </div>
          </div>
          <div className="row">
            <p><b>What time of the day are you getting/were you getting these minutes?</b></p>
          </div>
          <IonItem>
            <IonGrid>
              <IonRow>
                <IonCol><img src={sunrise.sourceSunrise} style={{ width: "100px", resize: "both", border: "double", cursor: "pointer" }} onClick={() => toggleImagesSun("sunrise")} /></IonCol>
                <IonCol><img src={sunrise.sourceMidday} style={{ width: "100px", resize: "both", border: "double", cursor: "pointer" }} onClick={() => toggleImagesSun("midday")} /></IonCol>
                <IonCol><img src={sunrise.sourceSunset} style={{ width: "100px", resize: "both", border: "double", cursor: "pointer" }} onClick={() => toggleImagesSun("sunset")} /></IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>


          <div className="row">
            <p><b>Are these minutes taken indoors or outdoor?</b></p>
          </div>
          <IonItem>
            <IonGrid>
              <IonRow>
                <IonCol><img src={environment.sourceIndoors} style={{ width: "100px", resize: "both", border: "double", cursor: "pointer" }} onClick={() => toggleImagesInOut("indoors")} /></IonCol>
                <IonCol><img src={environment.sourceOutdoors} style={{ width: "100px", resize: "both", border: "double", cursor: "pointer" }} onClick={() => toggleImagesInOut("outdoors")} /></IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
          <div className="row">
            <p><b>Now, please use the input field to enter the number of seconds you have run.</b></p>
          </div>
          <div className="row">
            <IonItem>
              <IonInput type="number" value={number} placeholder="Enter: " onIonChange={e => setNumber(parseInt(e.detail.value, 1000))}></IonInput>
            </IonItem>
            <IonButton >
              Submit
        </IonButton>
            <IonButton onClick={() => { window.location.reload() }}>
              Submit and add more
        </IonButton>

          </div>
        </div></IonContent>
        </IonPage>
  );
};

export default connect(
  (state, ownProps) => {
    return {
      account: state.account,
      teams: state.teams,
      boxes: state.boxes
    }
  },
  {

  }

)(MinuteEntry);
