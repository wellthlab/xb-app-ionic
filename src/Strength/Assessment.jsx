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
  IonList,
  IonLabel,
  IonInput,
} from "@ionic/react";
import { connect } from "react-redux";

import Timer, { resetTimer } from "../Instruments/Timer";

import "./StrengthWizard.css";

/**
 * props:
 *      week: int - Week number; just used to store/retrieve chosen movement
 */
const Assessment = (props) => {
  const [stage, innerSetStage] = useState(0);

  // Clear the timer's global state as we move between pages
  function setStage(stage) {
    resetTimer();
    innerSetStage(stage);
  }

  /**
   * Content contains all the pages, plus functions for checking if the stage is complete
   */
  var content = [];

  var week = props.week;

  content.push({
    el: (
      <>
        <h3>Week {week} Assessment</h3>
        <p>
          Some simple exercises can help to track progress. We'll walk you
          through three of them.
        </p>
        <ol>
          <li>The Wall Sit</li>
          <li>The Plank</li>
          <li>Profile of Mood States</li>
        </ol>
        <p>
          You can read more about these assessments in the ASSESSMENTS channel
          on Teams.
        </p>
      </>
    ),
    rule: function () {
      return true;
    },
  });

  const [plankTime, setPlankTime] = useState(null);
  const [wallTime, setWallTime] = useState(null);

  content.push({
    el: (
      <>
        <h3>Wall Sit</h3>
        <p>The wall sit assesses leg strength.</p>
        <p>
          Put your back against the wall, with your feet a thigh's-length in
          front of you. Slide your back down the wall until you are in a sitting
          position, with your thighs parallel to the floor.
        </p>
        <p>Time how long you can hold that position.</p>
        <p>
          If you can't get your thighs parallel with the floor, that's no
          problem. Note how low you can get; and don't worry about timing
          yourself.
        </p>
        <Timer onStop={setWallTime} />
      </>
    ),
    rule: function () {
      return true;
    },
  });

  content.push({
    el: (
      <>
        <h3>Plank</h3>
        <p>
          The plank engages lots of muscles, so is a good measure of general
          strength.
        </p>
        <p>
          Lay on the floor, and raise your upper body on to your elbows, so that
          they're directly below your shoulders. Make fists with your hands, and
          leave them on the floor.
        </p>
        <p>
          Now raise your bottom towards the ceiling, taking your knees off of
          the floor. Your body should be fairly straight, don't let your bottom
          sag downwards! Your head should be neutral, so you're looking down at
          the floor.
        </p>
        <p>Time how long you can hold that position. 60 seconds maximum!</p>
        <p>
          If you can't get into this form right now, that's fine. Make a note of
          how close you got, and where the challenges are.
        </p>
        <Timer onStop={setPlankTime} />
      </>
    ),
    rule: function () {
      return true;
    },
  });

  const [poms, setPoms] = useState({});

  content.push({
    el: (
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
      </>
    ),
    rule: function () {
      return true;
    },
  });

  /**
   * Final stage, save button!
   */
  content.push({
    el: (
      <>
        <IonTitle>Good work!</IonTitle>
        <p>Submit your baseline to record your progress.</p>
        <p>
          <strong>See you tomorrow!</strong>
        </p>
        <IonButton
          onClick={function () {
            var res = {};
            res.wallTime = wallTime;
            res.plankTime = plankTime;
            res.poms = poms;
            res.type = "assessment";
            props.onSubmit(res);
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
            <IonButton onClick={prevSlide} className="back">
              Back
            </IonButton>
          ) : (
            ""
          )}
          {nextExists &&
          c.rule() &&
          (typeof c.next == "undefined" || c.next != false) ? (
            <IonButton onClick={nextSlide} className="next">
              Next
            </IonButton>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }

  return slides[Math.min(stage, maxStage)];
};

export default Assessment;
