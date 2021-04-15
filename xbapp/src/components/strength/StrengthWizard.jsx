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
  IonItem,
} from "@ionic/react";
import { connect } from "react-redux";

import MovementPicker from "./MovementPicker";

import MovementTimer from "./MovementTimer";

import { useStorageItem } from "@capacitor-community/react-hooks/storage"; // Persistent storage

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



  const [stage, setStage] = useState(0);


  /**
   * Compile all the collected data into a response
   */
  function sendResponse() {
    var results = {};

    // TODO

    if (props.onSubmit) {
      props.onSubmit(results);
    }
  }

  /**
   * Content contains all the pages, plus functions for checking if the stage is complete
   */
  var content = [];

  /**
   * Set up the exercise picker
   */
  /* TODO: This doesn't work - useStorageItem is broken?
  // Use storage react hook to use capacitor storage to store weekly exercise choices
  var [exList, setExList] = useStorageItem("week" + props.week + "-exlist", false);

  // On first render, exList will be undefined - because it takes a cycle to be fetched
  if (typeof exList === 'undefined') {
    console.log(exList);
    return <ion-spinner name="crescent" />;
  }

  exList = JSON.parse(exList);
  */
  var [exList, setExList] = useState([]);

  content.push(
    {
      el: <MovementPicker
            onChange={(list) => {
              console.log("Set exercise list", list);
              setExList(list);
            }}
            number={2}
          />,
      rule: function() {
        console.log(exList);
        return exList.length == 2;
      }
    }

  );

  /**
   * Set up the timer and set counter
   */
  var week = props.week;
  var mins = Math.max(1, week - 1) * 7; // 7 minute increase per week, but just 7 in weeks 1 and 2

  const [sets, setSets] = useState(null);

  function updateSets(type, count) {
    var copy = {};
    Object.assign(copy, sets);

    copy[type] = count;

    setSets(copy);
  }

  content.push({
    el: <MovementTimer exercises={exList} onDone={() => {  }} onSetChange={ updateSets } mins={mins} countdownID={props.countdownID} />,
    rule: () => { return true; }
  });


  /**
   * Wire the stages together so we can progress from one to the next
   *
   */

  // Work out the maximum stage that's allowed
  var maxStage = 0;
  for(var i in content) {
    maxStage = i;
    if(!content[i].rule()) {
      console.log("Stage", i, "is not complete");
      break;
    }
  }

  console.log("Max stage is", maxStage, "of", content.length);

  // Wrap all the content into slides, with next buttons
  var slides = [];

  var nextSlide = () => {
    setStage(stage+1);
  }

  // TODO: Next button should be linked to whether page is complete or not
  for (var i in content) {
    var c = content[i];
    var nextExists = i < content.length - 1;


    console.log("Next exists?", nextExists);

    slides.push(
      <div key={"slide" + i}>
          {c.el}
          { nextExists ? <IonItem className="next"><IonButton onClick={nextSlide}>Next</IonButton></IonItem> : "" }
      </div>
    );
  }

  return slides[Math.min(stage, maxStage)];

};

export default StrengthWizard;
