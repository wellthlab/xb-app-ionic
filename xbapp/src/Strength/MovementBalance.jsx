import React, { useState, useEffect } from "react";

import {
  IonButton,
  IonItem,
  IonLabel,
  IonRow,
  IonGrid,
  IonCol,
  IonSelectOption,
  IonSelect
} from "@ionic/react";

import { connect } from "react-redux";
import CountDown from "../Instruments/CountDown";
import MovementInfoCard from "./MovementInfoCard";
import SetCounter from "./SetCounter";

import "./MovementBalance.css";

import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { PinDropSharp } from "@material-ui/icons";


const resultInitial = {
  EOHS: {
    completed: "",
    comfort: "",
    time: ""
  },
  ECHS: {
    completed: "",
    comfort: "",
    time: ""
  },
  EOHR: {
    completed: "",
    comfort: "",
    time: ""
  },
  ECHR: {
    completed: "",
    comfort: "",
    time: ""
  },
  EOHN: {
    completed: "",
    comfort: "",
    time: ""
  },
  ECHN: {
    completed: "",
    comfort: "",
    time: ""
  }
}
const resultInitialPractice = {
  rotation: {
    eye: "",
    reps: 0
  },
  nod: {
    eye: "",
    reps: 0
  },
  diag_left: {
    eye: "",
    reps: 0
  },
  diag_right: {
    eye: "",
    reps: 0
  },
}
const MovementBalance = (props) => {

  const [result, setResult] = React.useState(resultInitial);
  const [resultPractice, setResultPractice] = React.useState(resultInitialPractice);

  function updateResult(type, value) {
    if (type == "EOHSCompleted") {
      var newResult = result;
      newResult.EOHS.completed = value;
      setResult(newResult);
    } else if (type == "EOHSComfort") {
      var newResult = result;
      newResult.EOHS.comfort = value;
      setResult(newResult);
    } else if (type == "EOHSTime") {
      var newResult = result;
      newResult.EOHS.time = value;
      setResult(newResult);
    }

    if (type == "ECHSCompleted") {
      var newResult = result;
      newResult.ECHS.completed = value;
      setResult(newResult);
    } else if (type == "ECHSComfort") {
      var newResult = result;
      newResult.ECHS.comfort = value;
      setResult(newResult);
    } else if (type == "ECHSTime") {
      var newResult = result;
      newResult.ECHS.time = value;
      setResult(newResult);
    }

    if (type == "EOHRCompleted") {
      var newResult = result;
      newResult.EOHR.completed = value;
      setResult(newResult);
    } else if (type == "EOHRComfort") {
      var newResult = result;
      newResult.EOHR.comfort = value;
      setResult(newResult);
    } else if (type == "EOHRTime") {
      var newResult = result;
      newResult.EOHR.time = value;
      setResult(newResult);
    }

    if (type == "ECHRCompleted") {
      var newResult = result;
      newResult.ECHR.completed = value;
      setResult(newResult);
    } else if (type == "ECHRComfort") {
      var newResult = result;
      newResult.ECHR.comfort = value;
      setResult(newResult);
    } else if (type == "ECHRTime") {
      var newResult = result;
      newResult.ECHR.time = value;
      setResult(newResult);
    }

    if (type == "EOHNCompleted") {
      var newResult = result;
      newResult.EOHN.completed = value;
      setResult(newResult);
    } else if (type == "EOHNComfort") {
      var newResult = result;
      newResult.EOHN.comfort = value;
      setResult(newResult);
    } else if (type == "EOHNTime") {
      var newResult = result;
      newResult.EOHN.time = value;
      setResult(newResult);
    }

    if (type == "ECHNCompleted") {
      var newResult = result;
      newResult.EOHS.completed = value;
      setResult(newResult);
    } else if (type == "ECHNComfort") {
      var newResult = result;
      newResult.ECHN.comfort = value;
      setResult(newResult);
    } else if (type == "ECHNTime") {
      var newResult = result;
      newResult.ECHN.time = value;
      setResult(newResult);
    }

    if (props.onBalanceAssessmentChange) {
      props.onBalanceAssessmentChange(result);
    }
  }

  function updateResultPractice(type, value) {
    if (type == "rotation") {
      var newResult = resultPractice;
      newResult.rotation.eye = value;
      setResultPractice(newResult);
    } else if (type == "nod") {
      var newResult = resultPractice;
      newResult.nod.eye = value;
      setResultPractice(newResult);
    } else if (type == "diag_left") {
      var newResult = resultPractice;
      newResult.diag_left.eye = value;
      setResultPractice(newResult);
    } else if (type == "diag_right") {
      var newResult = resultPractice;
      newResult.diag_right.eye = value;
      setResultPractice(newResult);
    }
  }

  return (
    <div id="movementTimer">
      <IonGrid>
        <IonRow>
          <IonLabel>Begin in the stance you have selected below.</IonLabel>
        </IonRow>
        {(props.day % 2 == 0) ?
          <IonRow>
            <CountDown seconds={30} />
          </IonRow>
          : <IonRow>
            <CountDown minutes={1} seconds={30} />
          </IonRow>
        }

        <IonRow>
          {(props.day % 2 == 0) ?
            <>
              <IonCol>
                <div>
                  <MovementInfoCard
                    accordion={false}
                    titleSize={"small"}
                    key={Object.entries(props.exercises)[0][1]}
                    images={Object.entries(props.exercises)[0][1].images}
                    name={Object.entries(props.exercises)[0][1].name}
                  ></MovementInfoCard>
                </div>
              </IonCol>
              <IonRow>
                <IonLabel>Attempt to stay in this stance for 30 seconds while combining your visual and head movements in each of the following six ways. For each combination, record capability, comfort and time. If you are using single-leg stance, repeat the process for both legs.</IonLabel>
              </IonRow>
              <IonCol>
              <Accordion className="titleDrop">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2bh-content"
                >
                  <Typography>Eyes Open with Head Still</Typography>
                </AccordionSummary>
                <AccordionDetails className="detailsAcc" style={{ padding: "0px" }}>
                  <figure id="promo" style={{ marginTop: "0px", marginBottom: "0px" }}>
                    <img src={"assets/moves/balance/still.png"} className="A" />
                    <img src={"assets/moves/balance/still.png"} className="B" />
                  </figure>
                  <IonRow>
                    <IonItem>
                      <IonLabel>Capability:</IonLabel>
                      <IonSelect value={result.EOHS.completed} placeholder="Select" onIonChange={e => updateResult("EOHSCompleted", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="completed">Completed</IonSelectOption>
                        <IonSelectOption value="titled over to the left">Titled to the left</IonSelectOption>
                        <IonSelectOption value="titled over to the right">Titled to the right</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>
                  <IonRow>
                    <IonItem>
                      <IonLabel>Comfort:</IonLabel>
                      <IonSelect value={result.EOHS.comfort} placeholder="Select" onIonChange={e => updateResult("EOHSComfort", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="1">1</IonSelectOption>
                        <IonSelectOption value="2">2</IonSelectOption>
                        <IonSelectOption value="3">3</IonSelectOption>
                        <IonSelectOption value="4">4</IonSelectOption>
                        <IonSelectOption value="5">5</IonSelectOption>
                        <IonSelectOption value="6">6</IonSelectOption>
                        <IonSelectOption value="7">7</IonSelectOption>
                        <IonSelectOption value="8">8</IonSelectOption>
                        <IonSelectOption value="9">9</IonSelectOption>
                        <IonSelectOption value="10">10</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>

                  <IonRow>
                    <IonItem>
                      <IonLabel>Time:</IonLabel>
                      <IonSelect value={result.EOHS.time} placeholder="Select" onIonChange={e => updateResult("EOHSTime", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="Completed">Completed</IonSelectOption>
                        <IonSelectOption value="25 seconds">25 seconds</IonSelectOption>
                        <IonSelectOption value="20 seconds">20 seconds</IonSelectOption>
                        <IonSelectOption value="15 seconds">15 seconds</IonSelectOption>
                        <IonSelectOption value="10 seconds">10 seconds</IonSelectOption>
                        <IonSelectOption value="5 seconds">5 seconds</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>
                </AccordionDetails>
              </Accordion>
              </IonCol>
              <IonCol>
              <Accordion className="titleDrop">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2bh-content"
                >
                  <Typography >Eyes Closed with Head Still</Typography>
                </AccordionSummary>
                <AccordionDetails className="detailsAcc" style={{ padding: "0px" }}>
                  <figure id="promo" style={{ marginTop: "0px", marginBottom: "0px" }}>
                    <img src={"assets/moves/balance/still.png"} className="A" />
                    <img src={"assets/moves/balance/still.png"} className="B" />
                  </figure>
                  <IonRow>
                    <IonItem>
                      <IonLabel>Capability:</IonLabel>
                      <IonSelect value={result.ECHS.completed} placeholder="Select" onIonChange={e => updateResult("ECHSCompleted", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="completed">Completed</IonSelectOption>
                        <IonSelectOption value="titled over to the left">Titled to the left</IonSelectOption>
                        <IonSelectOption value="titled over to the right">Titled to the right</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>
                  <IonRow>
                    <IonItem>
                      <IonLabel>Comfort:</IonLabel>
                      <IonSelect value={result.ECHS.comfort} placeholder="Select" onIonChange={e => updateResult("ECHSComfort", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="1">1</IonSelectOption>
                        <IonSelectOption value="2">2</IonSelectOption>
                        <IonSelectOption value="3">3</IonSelectOption>
                        <IonSelectOption value="4">4</IonSelectOption>
                        <IonSelectOption value="5">5</IonSelectOption>
                        <IonSelectOption value="6">6</IonSelectOption>
                        <IonSelectOption value="7">7</IonSelectOption>
                        <IonSelectOption value="8">8</IonSelectOption>
                        <IonSelectOption value="9">9</IonSelectOption>
                        <IonSelectOption value="10">10</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>

                  <IonRow>
                    <IonItem>
                      <IonLabel>Time:</IonLabel>
                      <IonSelect value={result.ECHS.time} placeholder="Select" onIonChange={e => updateResult("ECHSTime", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="Completed">Completed</IonSelectOption>
                        <IonSelectOption value="25 seconds">25 seconds</IonSelectOption>
                        <IonSelectOption value="20 seconds">20 seconds</IonSelectOption>
                        <IonSelectOption value="15 seconds">15 seconds</IonSelectOption>
                        <IonSelectOption value="10 seconds">10 seconds</IonSelectOption>
                        <IonSelectOption value="5 seconds">5 seconds</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>
                </AccordionDetails>
              </Accordion>
              </IonCol>
              <IonCol>
              <Accordion className="titleDrop">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2bh-content"
                >
                  <Typography >Eyes Open with Head Rotations</Typography>
                </AccordionSummary>
                <AccordionDetails className="detailsAcc" style={{ padding: "0px" }}>
                  <figure id="promo" style={{ marginTop: "0px", marginBottom: "0px" }}>
                    <img src={"assets/moves/balance/rotate_left.png"} className="A" />
                    <img src={"assets/moves/balance/rotate_right.png"} className="B" />
                  </figure>
                  <IonRow>
                    <IonItem>
                      <IonLabel>Capability:</IonLabel>
                      <IonSelect value={result.EOHR.completed} placeholder="Select" onIonChange={e => updateResult("EOHRCompleted", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="completed">Completed</IonSelectOption>
                        <IonSelectOption value="titled over to the left">Titled to the left</IonSelectOption>
                        <IonSelectOption value="titled over to the right">Titled to the right</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>
                  <IonRow>
                    <IonItem>
                      <IonLabel>Comfort:</IonLabel>
                      <IonSelect value={result.EOHR.comfort} placeholder="Select" onIonChange={e => updateResult("EOHRComfort", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="1">1</IonSelectOption>
                        <IonSelectOption value="2">2</IonSelectOption>
                        <IonSelectOption value="3">3</IonSelectOption>
                        <IonSelectOption value="4">4</IonSelectOption>
                        <IonSelectOption value="5">5</IonSelectOption>
                        <IonSelectOption value="6">6</IonSelectOption>
                        <IonSelectOption value="7">7</IonSelectOption>
                        <IonSelectOption value="8">8</IonSelectOption>
                        <IonSelectOption value="9">9</IonSelectOption>
                        <IonSelectOption value="10">10</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>

                  <IonRow>
                    <IonItem>
                      <IonLabel>Time:</IonLabel>
                      <IonSelect value={result.EOHR.time} placeholder="Select" onIonChange={e => updateResult("EOHRTime", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="Completed">Completed</IonSelectOption>
                        <IonSelectOption value="25 seconds">25 seconds</IonSelectOption>
                        <IonSelectOption value="20 seconds">20 seconds</IonSelectOption>
                        <IonSelectOption value="15 seconds">15 seconds</IonSelectOption>
                        <IonSelectOption value="10 seconds">10 seconds</IonSelectOption>
                        <IonSelectOption value="5 seconds">5 seconds</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>
                </AccordionDetails>
              </Accordion>
              </IonCol>
              <IonCol>
              <Accordion className="titleDrop">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2bh-content"
                >
                  <Typography >Eyes Closed with Head Rotations</Typography>
                </AccordionSummary>
                <AccordionDetails className="detailsAcc" style={{ padding: "0px" }}>
                  <figure id="promo" style={{ marginTop: "0px", marginBottom: "0px" }}>
                    <img src={"assets/moves/balance/rotate_left.png"} className="A" />
                    <img src={"assets/moves/balance/rotate_right.png"} className="B" />
                  </figure>
                  <IonRow>
                    <IonItem>
                      <IonLabel>Capability:</IonLabel>
                      <IonSelect value={result.ECHR.completed} placeholder="Select" onIonChange={e => updateResult("ECHRCompleted", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="completed">Completed</IonSelectOption>
                        <IonSelectOption value="titled over to the left">Titled to the left</IonSelectOption>
                        <IonSelectOption value="titled over to the right">Titled to the right</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>
                  <IonRow>
                    <IonItem>
                      <IonLabel>Comfort:</IonLabel>
                      <IonSelect value={result.ECHR.comfort} placeholder="Select" onIonChange={e => updateResult("ECHRComfort", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="1">1</IonSelectOption>
                        <IonSelectOption value="2">2</IonSelectOption>
                        <IonSelectOption value="3">3</IonSelectOption>
                        <IonSelectOption value="4">4</IonSelectOption>
                        <IonSelectOption value="5">5</IonSelectOption>
                        <IonSelectOption value="6">6</IonSelectOption>
                        <IonSelectOption value="7">7</IonSelectOption>
                        <IonSelectOption value="8">8</IonSelectOption>
                        <IonSelectOption value="9">9</IonSelectOption>
                        <IonSelectOption value="10">10</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>

                  <IonRow>
                    <IonItem>
                      <IonLabel>Time:</IonLabel>
                      <IonSelect value={result.ECHR.time} placeholder="Select" onIonChange={e => updateResult("ECHRTime", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="Completed">Completed</IonSelectOption>
                        <IonSelectOption value="25 seconds">25 seconds</IonSelectOption>
                        <IonSelectOption value="20 seconds">20 seconds</IonSelectOption>
                        <IonSelectOption value="15 seconds">15 seconds</IonSelectOption>
                        <IonSelectOption value="10 seconds">10 seconds</IonSelectOption>
                        <IonSelectOption value="5 seconds">5 seconds</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>
                </AccordionDetails>
              </Accordion>
              </IonCol>
              <IonCol>
              <Accordion className="titleDrop">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2bh-content"
                >
                  <Typography >Eyes Open with Head Nods</Typography>
                </AccordionSummary>
                <AccordionDetails className="detailsAcc" style={{ padding: "0px" }}>
                  <figure id="promo" style={{ marginTop: "0px", marginBottom: "0px" }}>
                    <img src={"assets/moves/balance/nod_up.png"} className="A" />
                    <img src={"assets/moves/balance/nod_down.png"} className="B" />
                  </figure>
                  <IonRow>
                    <IonItem>
                      <IonLabel>Capability:</IonLabel>
                      <IonSelect value={result.EOHN.completed} placeholder="Select" onIonChange={e => updateResult("EOHNCompleted", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="completed">Completed</IonSelectOption>
                        <IonSelectOption value="titled over to the left">Titled to the left</IonSelectOption>
                        <IonSelectOption value="titled over to the right">Titled to the right</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>
                  <IonRow>
                    <IonItem>
                      <IonLabel>Comfort:</IonLabel>
                      <IonSelect value={result.EOHN.comfort} placeholder="Select" onIonChange={e => updateResult("EOHNComfort", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="1">1</IonSelectOption>
                        <IonSelectOption value="2">2</IonSelectOption>
                        <IonSelectOption value="3">3</IonSelectOption>
                        <IonSelectOption value="4">4</IonSelectOption>
                        <IonSelectOption value="5">5</IonSelectOption>
                        <IonSelectOption value="6">6</IonSelectOption>
                        <IonSelectOption value="7">7</IonSelectOption>
                        <IonSelectOption value="8">8</IonSelectOption>
                        <IonSelectOption value="9">9</IonSelectOption>
                        <IonSelectOption value="10">10</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>

                  <IonRow>
                    <IonItem>
                      <IonLabel>Time:</IonLabel>
                      <IonSelect value={result.EOHN.time} placeholder="Select" onIonChange={e => updateResult("EOHNTime", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="Completed">Completed</IonSelectOption>
                        <IonSelectOption value="25 seconds">25 seconds</IonSelectOption>
                        <IonSelectOption value="20 seconds">20 seconds</IonSelectOption>
                        <IonSelectOption value="15 seconds">15 seconds</IonSelectOption>
                        <IonSelectOption value="10 seconds">10 seconds</IonSelectOption>
                        <IonSelectOption value="5 seconds">5 seconds</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>
                </AccordionDetails>
              </Accordion>
              </IonCol>
              <IonCol>
              <Accordion className="titleDrop">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2bh-content"
                >
                  <Typography >Eyes Closed with Head Nods</Typography>
                </AccordionSummary>
                <AccordionDetails className="detailsAcc" style={{ padding: "0px" }}>
                  <figure id="promo" style={{ marginTop: "0px", marginBottom: "0px" }}>
                    <img src={"assets/moves/balance/nod_up.png"} className="A" />
                    <img src={"assets/moves/balance/nod_down.png"} className="B" />
                  </figure>
                  <IonRow>
                    <IonItem>
                      <IonLabel>Capability:</IonLabel>
                      <IonSelect value={result.ECHN.completed} placeholder="Select" onIonChange={e => updateResult("ECHNCompleted", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="completed">Completed</IonSelectOption>
                        <IonSelectOption value="titled over to the left">Titled to the left</IonSelectOption>
                        <IonSelectOption value="titled over to the right">Titled to the right</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>
                  <IonRow>
                    <IonItem>
                      <IonLabel>Comfort:</IonLabel>
                      <IonSelect value={result.ECHN.comfort} placeholder="Select" onIonChange={e => updateResult("ECHNComfort", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="1">1</IonSelectOption>
                        <IonSelectOption value="2">2</IonSelectOption>
                        <IonSelectOption value="3">3</IonSelectOption>
                        <IonSelectOption value="4">4</IonSelectOption>
                        <IonSelectOption value="5">5</IonSelectOption>
                        <IonSelectOption value="6">6</IonSelectOption>
                        <IonSelectOption value="7">7</IonSelectOption>
                        <IonSelectOption value="8">8</IonSelectOption>
                        <IonSelectOption value="9">9</IonSelectOption>
                        <IonSelectOption value="10">10</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>

                  <IonRow>
                    <IonItem>
                      <IonLabel>Time:</IonLabel>
                      <IonSelect value={result.ECHN.time} placeholder="Select" onIonChange={e => updateResult("ECHNTime", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="Completed">Completed</IonSelectOption>
                        <IonSelectOption value="25 seconds">25 seconds</IonSelectOption>
                        <IonSelectOption value="20 seconds">20 seconds</IonSelectOption>
                        <IonSelectOption value="15 seconds">15 seconds</IonSelectOption>
                        <IonSelectOption value="10 seconds">10 seconds</IonSelectOption>
                        <IonSelectOption value="5 seconds">5 seconds</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>
                </AccordionDetails>
              </Accordion>
              </IonCol>
              <IonRow>
              </IonRow>
            </>
            :
            <>
              <IonCol>
                <div>
                  <MovementInfoCard
                    accordion={false}
                    titleSize={"small"}
                    key={Object.entries(props.exercises)[1][1]}
                    images={Object.entries(props.exercises)[1][1].images}
                    name={Object.entries(props.exercises)[1][1].name}
                  ></MovementInfoCard>
                </div>
              </IonCol>
              <IonRow>
                <IonLabel>For each of the following 4 exercises, SELECT the eye position, do the movement for 1:30 minutes, and record how many sets (of 5 REPS) and remaining reps you did.</IonLabel>
              </IonRow>
              <IonCol>
              <Accordion className="titleDrop">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2bh-content"
                >
                  <Typography >Head Rotations</Typography>
                </AccordionSummary>
                <AccordionDetails className="detailsAcc" style={{ padding: "0px" }}>
                  <figure id="promo" style={{ marginTop: "0px", marginBottom: "0px" }}>
                    <img src={"assets/moves/balance/left.png"} className="A" />
                    <img src={"assets/moves/balance/right.png"} className="B" />
                  </figure>
                  <IonRow>
                    <IonItem>
                      <IonLabel>Eye Position:</IonLabel>
                      <IonSelect value={resultPractice.rotation.eye} placeholder="Select" onIonChange={e => updateResultPractice("rotation", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="yes fixed straight ahead">Eyes fixed straight ahead</IonSelectOption>
                        <IonSelectOption value="Eyes moving with head">Eyes moving with head</IonSelectOption>
                        <IonSelectOption value="Eyes moving opposition to head">Eyes moving opposition to head</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>
                  <IonRow>
                    <SetCounter
                      showReps={true}
                      sets={0}
                      onChange={(reps) => {
                        console.log(reps);
                        var newResult = resultPractice;
                        newResult.rotation.reps = reps;
                        setResultPractice(newResult);
                      }}
                    /></IonRow>
                </AccordionDetails>
              </Accordion>
              </IonCol>
              <IonCol>
              <Accordion className="titleDrop">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2bh-content"
                >
                  <Typography >Head Nod</Typography>
                </AccordionSummary>
                <AccordionDetails className="detailsAcc" style={{ padding: "0px" }}>
                  <figure id="promo" style={{ marginTop: "0px", marginBottom: "0px" }}>
                    <img src={"assets/moves/balance/nod_up.png"} className="A" />
                    <img src={"assets/moves/balance/nod_down.png"} className="B" />
                  </figure>
                  <IonRow>
                    <IonItem>
                      <IonLabel>Eye Position:</IonLabel>
                      <IonSelect value={resultPractice.nod.eye} placeholder="Select" onIonChange={e => updateResultPractice("nod", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="yes fixed straight ahead">Eyes fixed straight ahead</IonSelectOption>
                        <IonSelectOption value="Eyes moving with head">Eyes moving with head</IonSelectOption>
                        <IonSelectOption value="Eyes moving opposition to head">Eyes moving opposition to head</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>
                  <IonRow>
                    <SetCounter
                      showReps={true}
                      sets={0}
                      onChange={(reps) => {
                        var newResult = resultPractice;
                        newResult.nod.reps = reps;
                        setResultPractice(newResult);
                      }}
                    /></IonRow>
                </AccordionDetails>
              </Accordion>
              </IonCol>
              <IonCol>
              <Accordion className="titleDrop">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2bh-content"
                >
                  <Typography >Diagonal Nod (1)</Typography>
                </AccordionSummary>
                <AccordionDetails className="detailsAcc" style={{ padding: "0px" }}>
                  <figure id="promo" style={{ marginTop: "0px", marginBottom: "0px" }}>
                    <img src={"assets/moves/balance/topleft.png"} className="A" />
                    <img src={"assets/moves/balance/bottomright.png"} className="B" />
                  </figure>
                  <IonRow>
                    <IonItem>
                      <IonLabel>Eye Position:</IonLabel>
                      <IonSelect value={resultPractice.diag_left.eye} placeholder="Select" onIonChange={e => updateResultPractice("diag_left", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="yes fixed straight ahead">Eyes fixed straight ahead</IonSelectOption>
                        <IonSelectOption value="Eyes moving with head">Eyes moving with head</IonSelectOption>
                        <IonSelectOption value="Eyes moving opposition to head">Eyes moving opposition to head</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>
                  <IonRow>
                    <SetCounter
                      showReps={true}
                      sets={0}
                      onChange={(reps) => {
                        console.log(reps);
                        var newResult = resultPractice;
                        newResult.diag_left.reps = reps;
                        setResultPractice(newResult);
                      }}
                    /></IonRow>
                </AccordionDetails>
              </Accordion>
              </IonCol>
              <IonCol>
              <Accordion className="titleDrop">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2bh-content"
                >
                  <Typography >Diagonal Nod (2)</Typography>
                </AccordionSummary>
                <AccordionDetails className="detailsAcc" style={{ padding: "0px" }}>
                  <figure id="promo" style={{ marginTop: "0px", marginBottom: "0px" }}>
                    <img src={"assets/moves/balance/topright.png"} className="A" />
                    <img src={"assets/moves/balance/bottomleft.png"} className="B" />
                  </figure>
                  <IonRow>
                    <IonItem>
                      <IonLabel>Eye Position:</IonLabel>
                      <IonSelect value={resultPractice.diag_right.eye} placeholder="Select" onIonChange={e => updateResultPractice("diag_right", e.detail.value)} style={{ width: "180px" }}>
                        <IonSelectOption value="yes fixed straight ahead">Eyes fixed straight ahead</IonSelectOption>
                        <IonSelectOption value="Eyes moving with head">Eyes moving with head</IonSelectOption>
                        <IonSelectOption value="Eyes moving opposition to head">Eyes moving opposition to head</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonRow>
                  <IonRow>
                    <SetCounter
                      showReps={true}
                      sets={0}
                      onChange={(reps) => {
                        var newResult = resultPractice;
                        newResult.diag_right.reps = reps;
                        setResultPractice(newResult);
                      }}
                    /></IonRow>
                </AccordionDetails>
              </Accordion>
              </IonCol>
            </>
          }
        </IonRow>
      </IonGrid>



    </div>
  );
};

export default MovementBalance;
