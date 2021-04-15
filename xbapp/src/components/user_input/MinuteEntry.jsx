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
import CountDown from "./CountDown";
import mobiscroll from "@mobiscroll/react-lite";
import "@mobiscroll/react-lite/dist/css/mobiscroll.min.css";

import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import GenericAlert from "../GenericAlert";

//we have the experiment/group ID, we have the day number to require update and we have the account
//=> can we update the day?
//need to handle the click of "submit" in both cases: when they use the timer or when they use an input field
const MinuteEntry = (props) => {
  var [timerSeconds, setTimerSeconds] = useState(0);
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
  const [timerFinished, setTimerFinished] = useState(false);

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
    var min = 0;
    if (expanded == "panel2") {
      min = Math.floor(localStorage.getItem("time") / 60);
      //we don;t need the timer on/showing in the feed anymore - so we are removing the items related to timer
      localStorage.removeItem("recordedSeconds");
      localStorage.removeItem("recordedMinutes");
      localStorage.removeItem("recordedHours");
      localStorage.removeItem("countActive");
      localStorage.removeItem("timerStartedAt");
    } else if (expanded == "panel3") {
      min = number.value;
    }
    var response = {
      minutes: min,
      location: variables.place,
      time: variables.timeOfDay,
    };

    if (expanded == false) {
      //if the user hasn't picked an input method for minutes
      toggleAlert();
    } else {
      if (props.onSubmit) {
        props.onSubmit(response);
      }
    }
  }

  const [expanded, setExpanded] = React.useState(false);
  const [showAlert, setShowAlert] = useState(false);
  function toggleAlert() {
    setShowAlert(!showAlert);
  }

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="addMinutes">
      <GenericAlert
        showAlert={showAlert}
        toggleAlert={toggleAlert}
        message={
          "Please choose one of the Input methods (Timer or Manual Minutes) by tapping on the title."
        }
      />
      <div className="row">
        <h4>How'd you prefer to add movement minutes?</h4>

        <Accordion
          className="titleDrop"
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
          >
            <Typography>Timer</Typography>
          </AccordionSummary>
          <AccordionDetails className="detailsAcc">
            <Timer
              onStop={async (seconds) => {
                setTimerSeconds(seconds);
              }}
              buttonsOnShow={true}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion
          className="titleDrop"
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
          >
            <Typography>Manual Minutes</Typography>
          </AccordionSummary>
          <AccordionDetails className="detailsAcc">
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
          </AccordionDetails>
        </Accordion>
      </div>

      <div className="row">
        <h4>When did you get these minutes?</h4>
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
        <h4>Did you get them indoors or outdoors?</h4>
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
