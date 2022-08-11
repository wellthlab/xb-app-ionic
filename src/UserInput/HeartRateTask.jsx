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
import HeartRate from "../Strength/HeartRate";

const HeartRateTask = (props) => {
  useEffect(() => {}, []);

  const [heart, setHeart] = React.useState(null);
  //expecting week to be passed as prop
  let week = props.week;

  return (
    <>
      <HeartRate
        onChange={(rate) => {
          setHeart(rate);
        }}
      />
      <IonButton
        onClick={function () {
          var res = {};
          res.heartrate = heart;
          res.type = "heartrate";
          props.onSubmit(res);
        }}
      >
        Submit
      </IonButton>
    </>
  );
};

export default HeartRateTask;
