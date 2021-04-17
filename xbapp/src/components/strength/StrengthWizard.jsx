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
  IonTitle,
  IonItem,
} from "@ionic/react";
import { connect } from "react-redux";

import MovementPicker from "./MovementPicker";
import MovementTimer from "./MovementTimer";
import HeartRate from "./HeartRate";
import LevelFinder from "./LevelFinder";

import { useStorageItem } from "@capacitor-community/react-hooks/storage"; // Persistent storage

import './StrengthWizard.css';

/**
 * props:
 *      week: int - Week number; just used to store/retrieve chosen movement
 *      mins: Minutes of movement required
 *
 */
const StrengthWizard = (props) => {
  const [stage, setStage] = useState(0);

  /**
   * Content contains all the pages, plus functions for checking if the stage is complete
   */
  var content = [];

 /**
  * Instructions
  */
 if(week == 1) {
    var rubric = "This week, you're exploring the different moves. Pick one upper and lower body move each day and try them out. ";
} else {
    var rubric = "This week, you'll do the same exercises each day. One upper body, and one lower body.";
}


 content.push({
    el: <>
            <h3>Week {week}</h3>
            <p>{rubric}</p>
        </>,
    rule: function(){
        return true;
    }
 });


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

  const [sets, setSets] = useState(null);

  /**
   * Normal flow is to pick two moves and do them
   */
  if(week > 1) {
      content.push({
        el: (
            <>
                <h3>Choose Today's Routine</h3>
                <p>
                  Please select one <span>upper body</span> movement and one{" "}
                  <span>lower body</span> movement.
                </p>
                <MovementPicker
                    onChange={(list) => {
                      console.log("Set exercise list", list);
                      setExList(list);
                    }}
                    number={2}
                />
              </>
        ),
        rule: function () {
          console.log(exList);
          return exList.length == 2;
        },
      });

      /**
       * Set up the timer and set counter
       */
      var week = props.week;
      var mins = Math.max(1, week - 1) * 7; // 7 minute increase per week, but just 7 in weeks 1 and 2

      function updateSets(type, count) {
        var copy = {};
        Object.assign(copy, sets);

        copy[type] = count;

        setSets(copy);
      }

      content.push({
        el: (
          <MovementTimer
            exercises={exList}
            onDone={() => {}}
            onSetChange={updateSets}
            mins={mins}
            countdownID={props.countdownID}
          />
        ),
        rule: () => {
          return true;
        },
      });

  /**
  * But in week 1, just explore different moves to find a level
  */
  } else {
    content.push({
        el: (
          <>
            <h3>Choose a Move</h3>
            <p>
              Please select the <span>upper body</span> movement you'd like to explore today.
            </p>
            <MovementPicker
                upper={true} lower={false}
                onChange={(list) => {
                  console.log("Set exercise list", list);
                  setExList(list);
                  var newsets = Object.assign({}, sets);
                  newsets[list[0]] = "explore"; // Record the chosen exercise
                  setSets(newsets);
                  nextSlide();
                }}
                number={1}
            />
          </>
        ),
        rule: function () {
          console.log(exList);
          return exList.length == 1;
        },
    });


    content.push({
        el: (
            <LevelFinder exercise={exList[0]} />
        ),
        rule: () => { return true; },
        previous: true
    });

    content.push({
        el: (
            <>
              <h3>Choose a Move</h3>
              <p>
                Please select the <span>lower body</span> movement you'd like to explore today.
              </p>
              <MovementPicker
                  upper={false} lower={true}
                  onChange={(list) => {
                    console.log("Set exercise list", list);
                    setExList(list);
                    var newsets = Object.assign({}, sets);
                    newsets[list[0]] = "explore"; // Record the chosen exercise
                    setSets(newsets);
                    nextSlide();
                  }}
                  number={1}
              />
            </>
          ),
          rule: function () {
            console.log(exList);
            return exList.length == 1;
          },
        });

        content.push({
            el: (
                <LevelFinder exercise={exList[0]} />
            ),
            rule: () => { return true; },
            previous: true
        });
  }



  /**
   * Heart Rate and effort review
   */
  const [postHeart, setPostHeart] = useState(null);

  content.push({
    el: (
      <HeartRate
        onChange={(rate) => {
          console.log("Set Heart Rate", rate);
          setPostHeart(rate);
        }}
      />
    ),
    rule: () => {
      return postHeart !== null;
    },
  });

  /**
   * Final stage, save button!
   */
  content.push({
    el: (
      <>
        <IonTitle>Good work!</IonTitle>
        <p>Submit your workout to record your progress.</p>
        <p>
          <strong>See you tomorrow!</strong>
        </p>
        <IonButton
          onClick={function () {
            var res = {};
            res.sets = sets; // Contains exercises and number of sets
            res.heartrate = postHeart; // Contains heart rate
            res.type = "strength";
            var rmins = {};
            rmins.type = "minutes";
            rmins.minutes = mins;
            props.onSubmit([res, rmins]);
          }}
        >
          Submit
        </IonButton>
      </>
    ),
    rule: () => {
      return true;
    },
  });

  /**
   * Wire the stages together so we can progress from one to the next
   *
   */

  // Work out the maximum stage that's allowed
  var maxStage = 0;
  for (var i in content) {
    maxStage = i;
    if (!content[i].rule()) {
      console.log("Stage", i, "is not complete");
      break;
    }
  }

  console.log("Max stage is", maxStage, "of", content.length);

  // Wrap all the content into slides, with next buttons
  var slides = [];

  var nextSlide = () => {
    setStage(stage + 1);
  };

  var prevSlide = () => {
    setStage(stage - 1);
  };


  // TODO: Next button should be linked to whether page is complete or not
  for (var i in content) {
    var c = content[i];
    var nextExists = i < content.length - 1;

    slides.push(
      <div key={"slide" + i}>
        {c.el}
          <div className="buttons">
          {c.previous ? (
              <IonButton onClick={prevSlide} className="back">Back</IonButton>
          ) : "" }
          {nextExists && c.rule() ? (
              <IonButton onClick={nextSlide} className="next">Next</IonButton>
          ) : (
            ""
          )}
          </div>
      </div>
    );
  }

  return slides[Math.min(stage, maxStage)];
};

export default StrengthWizard;
