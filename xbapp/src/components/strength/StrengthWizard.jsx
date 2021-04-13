/**
 * The Strength input widget steps people through the daily strength routine
 * and returns data about the workout
 *
 */
import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonSlides,
  IonSlide,
  IonContent,
  IonItem
} from "@ionic/react";
import { connect } from "react-redux";

import MovementPicker from "./MovementPicker";

import MovementTimer from "./MovementTimer";

import { useStorageItem } from '@capacitor-community/react-hooks/storage' // Persistent storage

/**
 * props:
 *      week: int - Week number; just used to store/retrieve chosen movement
 *      mins: Minutes of movement required
 *
 */
const StrengthWizard = (props) => {
  const [preHeart, setPreHeart] = useState(null);
  const [postHeart, setPostHeart] = useState(null);

  const [postBreath, setPostBreath] = useState(null);

  const [enjoyment, setEnjoyment] = useState(null);

  const [reps, setReps] = useState(null);

  // Use storage react hook to use capacitor storage to store weekly exercise choices
  var [exList, setExList] = useStorageItem('week' + props.week + '-exlist', []);

  console.log("Week is ", props.week);

  function sendResponse() {
    var results = {};

    // TODO: Compile results from the pages into a response object to be saved

    if (props.onSubmit) {
      props.onSubmit(results);
    }
  }

  var content = [];

  // On first render, exList will be undefined - because it takes a cycle to be fetched
  if(!exList) {
    return <ion-spinner name="crescent" />;
  }

  // exList will be returned as a string
  exList = JSON.parse(exList);

  // Movement chooser shows up first
  if(exList.length < 2) {
    content.push( <MovementPicker onChange={async (list) => {
      setExList(list);
    }} number={2} /> );
  }


  // Movement Timer is page 2
  content.push( <MovementTimer exercises={exList} onChange={ () => {

  }} /> );

  // Wrap all the content into slides, with next buttons
  var slides = [];

  // TODO: Next button should be linked to whether page is complete or not
  for (var i in content) {
    var c = content[i];
    var next =
      typeof content[i + 1] == "undefined" ? (
        <></>
      ) : (
        <IonButton>Next</IonButton>
      );
    slides.push(
      <IonSlide key={"slide" + i}>
        <IonContent>
        {c}
        <IonItem>{next}</IonItem>
        </IonContent>
      </IonSlide>
    );
  }

  // use ion-slides to provide slide functionality
  // and wrap each page in ion-slide
  return <IonSlides pager={true} scrollbar={true}>{slides}</IonSlides>;
};

export default StrengthWizard;
