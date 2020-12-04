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
const ExperimentProof = async (props) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [number, setNumber] = useState();
  const [sunrise, setSunrise] = useState({ sourceSunrise: "assets/suns/sunrise1.png", sourceMidday: "assets/suns/midday1.png", sourceSunset: "assets/suns/sunset1.png" });
  const [environment, setEnvironment] = useState({ sourceIndoors: "assets/inout/indoors1.png", sourceOutdoors: "assets/inout/outdoors1.png" });

  var gid = props.match.params.id1; // Group ID comes from route
  var group = false;
  for (var g of props.teams.teams) { // Find the group in the store
    if (g._id == gid) {
      group = g;
    }
  }

  console.log("Group info", group, props.teams.teams);

  var experiment = group.experiment;

  var last_experiment_day = experiment.info.duration;
  var day_number = props.match.params.id2;

  function toggle() {
    setIsActive(!isActive);
  }
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

  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

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
            <p><b>Now, please use either our TIMER, or the input fiels to enter the number of seconds you have run.</b></p>
          </div>
          {last_experiment_day = day_number ? <div>
            <div className="time">{seconds}s</div>
            <div className="row">
              <Timer/>
            </div>
            <div className="row">
              <IonButton >
                Submit
        </IonButton>
              <IonButton onClick={() => { window.location.reload() }}>
                Submit and add more
        </IonButton>
            </div>
            <div className="row">
              <p>Or</p>
            </div>
          </div> : <div></div>}
          <div className="row">
            <p>Input a number of seconds below:</p>
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
        </div></IonContent></IonPage>
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

)(ExperimentProof);
