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
} from "@ionic/react";
import { connect } from "react-redux";

import MovementPicker from "./MovementPicker";
import MovementInfoCard from "./MovementInfoCard";

import { useStorage } from '@capacitor-community/react-hooks/storage' // Persistent storage

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
  const [exList, setExList] = useStorage('week' + props.week + '-exlist');

  function sendResponse() {
    var results = {};

    // TODO: Compile results from the pages into a response object to be saved

    if (props.onSubmit) {
      props.onSubmit(results);
    }
  }

  var picker = <MovementPicker onSubmit={async (list) => {
    setExList(list);
  }} number={2} />

  // TODO: Rest of the pagess
  //var timer =

  var content = [
    picker,

  ];

  // Wrap all the content into slides, with next buttons
  var slides = [];

  for (var i in content) {
    var c = content[i];
    var next =
      typeof content[i + 1] == "undefined" ? (
        <></>
      ) : (
        <IonButton>Next</IonButton>
      );
    slides.push(
      <IonSlide>
        {c}
        {next}
      </IonSlide>
    );
  }

  // use ion-slides to provide slide functionality
  // and wrap each page in ion-slide
  return <IonSlides pager={true}>{slides}</IonSlides>;
};

export default StrengthWizard;
