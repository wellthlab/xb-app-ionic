/**
 * The Strength input widget steps people through the daily strength routine
 * and returns data about the workout
 *
 */
import React, { useState, useEffect } from "react";
import {
  IonItem,
  IonListHeader,
  IonContent,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItemDivider,
  IonButton,
  IonSlides,
  IonSlide,
} from "@ionic/react";
import { connect } from "react-redux";

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

  // TODO: Use storage react hook to use capacitor storage to store weekly exercise choices
  // https://github.com/capacitor-community/react-hooks

  // use ion-slides to provide slide functionality
  // and wrap each page in ion-slide

  function sendResponse() {
    var objectToAdd = {};

    if (props.onSubmit) {
      props.onSubmit(objectToAdd);
    }
  }

  var content = [];

  var pager;

  // Wrap all the content into slides, with next buttons
  var slides = [];

  for (var i in content) {
    var c = content[i];
    var next;
    if (typeof content[i + 1] == "undefined") {
      next = <IonButton onClick={sendResponse}>Done</IonButton>;
    } else {
      next = (
        <IonButton
          onClick={() => {
            pager.slideNext();
          }}
        >
          Next
        </IonButton>
      );
    }

    slides.push(
      <IonSlide>
        {c}
        {next}
      </IonSlide>
    );
  }

  pager = (
    <IonSlides
      pager={true}
      options={{ allowSlideNext: false, allowSlidePrev: false }}
    >
      {slides}
    </IonSlides>
  );

  return pager;
};

export default Questionnaire;
