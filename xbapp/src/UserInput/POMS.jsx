import {
  IonBackButton,
  IonButton,
  IonLabel,
  IonList,
  IonItem,
  IonInput,
  IonTitle,
} from "@ionic/react";
import React, { Component } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";


const POMS = (props) => {
  useEffect(() => {}, []);
  const history = useHistory();

  const [poms, setPoms] = React.useState({});
  //expecting week to be passed as prop
  let week = props.week;

  return (
    <>
    <h3>POMS</h3>
    <p>The Profile of Mood States helps to assess your mood.</p>
    <p>Complete the POMS online, and enter your score below.</p>
    <IonButton href="https://www.brianmac.co.uk/poms.htm">
      Take the POMS
    </IonButton>
    <IonList>
      {[
        "Total Mood Disturbance",
        "Anger",
        "Confusion",
        "Depression",
        "Fatigue",
        "Tension",
        "Vigour",
      ].map(function (item, num) {
        return (
          <IonItem>
            <IonLabel position="stacked">{item}</IonLabel>
            <IonInput
              type="number"
              onIonChange={(e) => {
                var newpoms = Object.assign({}, poms);
                newpoms[item] = e.detail.value;
                setPoms(newpoms);
              }}
            />
          </IonItem>
        );
      })}
    </IonList>
    <IonButton
          onClick={function () {
            var res = {};
            res.poms = poms;
            res.type = "poms";
            props.onSubmit(res);
          }}
        >
          Submit
        </IonButton>

  </>

  );
};

export default POMS;
