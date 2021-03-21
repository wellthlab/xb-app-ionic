import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonItem,
  IonInput,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import "./MinuteEntry.scss";
import { connect } from "react-redux";
import Timer from "./Timer";
import mobiscroll from "@mobiscroll/react-lite";
import "@mobiscroll/react-lite/dist/css/mobiscroll.min.css";
import "./ExperimentList.css";

//we have the experiment/group ID, we have the day number to require update and we have the account
//=> can we update the day?
//need to handle the click of "submit" in both cases: when they use the timer or when they use an input field
const MinuteEntry = (props) => {
  const [number, setNumber] = useState({ value: 0 });
  const [sunrise, setSunrise] = useState({
    sourceSunrise: "assets/suns/sunrise1.png",
    sourceMidday: "assets/suns/midday1.png",
    sourceSunset: "assets/suns/sunset1.png",
  });
  const [environment, setEnvironment] = useState({
    sourceIndoors: "assets/inout/indoors1.png",
    sourceOutdoors: "assets/inout/outdoors1.png",
  });

  const [variables, setVariables] = useState({ place: "", timeOfDay: "" });
  const [pickTimer, setPickTimer] = useState(true);
  const [pickManual, setPickManual] = useState(false);

  function toggleImagesSun(imageToChange) {
    if (imageToChange == "sunrise") {
      setSunrise({
        sourceSunrise: "assets/suns/sunrise2.png",
        sourceMidday: "assets/suns/midday1.png",
        sourceSunset: "assets/suns/sunset1.png",
      });
      setVariables({ place: variables.place, timeOfDay: "morning" });
    } else if (imageToChange == "midday") {
      setSunrise({
        sourceSunrise: "assets/suns/sunrise1.png",
        sourceMidday: "assets/suns/midday2.png",
        sourceSunset: "assets/suns/sunset1.png",
      });
      setVariables({ place: variables.place, timeOfDay: "midday" });
    } else if (imageToChange == "sunset") {
      setSunrise({
        sourceSunrise: "assets/suns/sunrise1.png",
        sourceMidday: "assets/suns/midday1.png",
        sourceSunset: "assets/suns/sunset2.png",
      });
      setVariables({ place: variables.place, timeOfDay: "evening" });
    }
  }

  function toggleImagesInOut(imageToChange) {
    if (imageToChange == "indoors") {
      setEnvironment({
        sourceIndoors: "assets/inout/indoors2.png",
        sourceOutdoors: "assets/inout/outdoors1.png",
      });
      setVariables({ place: "indoors", timeOfDay: variables.timeOfDay });
    } else if (imageToChange == "outdoors") {
      setEnvironment({
        sourceIndoors: "assets/inout/indoors1.png",
        sourceOutdoors: "assets/inout/outdoors2.png",
      });
      setVariables({ place: "outdoors", timeOfDay: variables.timeOfDay });
    }
  }

  function save() {
      const min = 0;
    if (pickTimer){
        min = Math.floor(localStorage.getItem("time")/60);
    } else if (pickManual){
        min = number.value;
    }
    var response = {
      minutes: min,
      location: variables.place,
      time: variables.timeOfDay,
    };

    if (props.onSubmit) {
      props.onSubmit(response);
    }
  }

  return (
    <div className="addMinutes">
      <div className="row">
        <p>How many movement minutes are you adding?</p>

        <mobiscroll.Form>
        <mobiscroll.Accordion>
          <mobiscroll.FormGroup collapsible open={pickTimer}>
            <mobiscroll.FormGroupTitle
              className="titleDrop"
              onClick={() => {
                alert("coco");
                setPickTimer(!pickTimer);
                if (pickManual == true) setPickManual(false);
              }}
            >
              <b>Timer</b>
            </mobiscroll.FormGroupTitle>
            <mobiscroll.FormGroupContent>
              <div className="mbsc-padding">
                <Timer />
              </div>
            </mobiscroll.FormGroupContent>
          </mobiscroll.FormGroup>
        </mobiscroll.Accordion>
        <mobiscroll.Accordion>
          <mobiscroll.FormGroup collapsible open={pickManual}>
            <mobiscroll.FormGroupTitle
              className="titleDrop"
              onClick={() => {
                if (pickTimer == true) setPickTimer(false);
                setPickManual(!pickManual);
              }}
            >
              <b>Manual Minutes</b>
            </mobiscroll.FormGroupTitle>
            <mobiscroll.FormGroupContent>
              <div className="mbsc-padding">
              <IonItem>
          <IonInput
            className="minutes"
            min="1"
            max="600"
            type="number"
            value={number.value}
            placeholder="Enter: "
            onIonChange={(e) => setNumber({ value: e.detail.value })}
          ></IonInput>
        </IonItem>
              </div>
            </mobiscroll.FormGroupContent>
          </mobiscroll.FormGroup>
        </mobiscroll.Accordion>
      </mobiscroll.Form>
      </div>

      <div className="row">
        <p>What time of the day did you get these minutes?</p>
        <IonItem>
          <IonGrid>
            <IonRow>
              <IonCol>
                <img
                  src={sunrise.sourceSunrise}
                  onClick={() => toggleImagesSun("sunrise")}
                />
              </IonCol>
              <IonCol>
                <img
                  src={sunrise.sourceMidday}
                  onClick={() => toggleImagesSun("midday")}
                />
              </IonCol>
              <IonCol>
                <img
                  src={sunrise.sourceSunset}
                  onClick={() => toggleImagesSun("sunset")}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      </div>

      <div className="row">
        <p>Did you get them indoors or outdoors?</p>
        <IonItem>
          <IonGrid>
            <IonRow>
              <IonCol>
                <img
                  src={environment.sourceIndoors}
                  onClick={() => toggleImagesInOut("indoors")}
                />
              </IonCol>
              <IonCol>
                <img
                  src={environment.sourceOutdoors}
                  onClick={() => toggleImagesInOut("outdoors")}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      </div>

      <div className="row">
        <IonButton onClick={save}>Save Minutes</IonButton>
        {/* TODO: "Save and Add More" */}
      </div>
    </div>
  );
};

export default MinuteEntry;
