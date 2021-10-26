import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonGrid,
  IonCol,
  IonRow,
  IonItem,
  IonList,
  IonLabel,
  IonListHeader,
  IonTextarea,
} from "@ionic/react";
import { useHistory } from "react-router";
import { connect } from "react-redux";

import MovementPicker, {
  getMove,
} from "../DEPRECATED/components/OLDMovementPicker";
import MovementInfoCard from "./MovementInfoCard";
import MovementTimer from "./MovementTimer";
import HeartRate from "./HeartRate";
import LevelFinder from "./LevelFinder";
import RPE from "../UserInput/RPE";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import { useStorageItem } from "@capacitor-community/react-hooks/storage"; // Persistent storage

import "./StrengthWizard.css";

function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

const StrengthWizard = ({ week, onSubmit, countdownID }) => {
  const [stage, setStage] = useState(0);

  var blocks = week;
  if (blocks > 5) blocks = 5;

  /**
   * Content contains all the pages, plus functions for checking if the stage is complete
   */
  var content = [];
  content[0] = { placeholder: true }; // A placeholder for the real first page, which we'll assemble later

  /**
   * Heart Rate and effort review
   */
  const [preHeart, setPreHeart] = useState(null);

  content.push({
    el: (
      <>
        <h3>Pre-Exercise Heart Rate</h3>
        <HeartRate
          onChange={(rate) => {
            setPreHeart(rate);
          }}
        />
      </>
    ),
    rule: () => {
      return preHeart !== null;
    },
    title: "Pre-exercise Heart Rate",
  });

  /**
   * Go through each block
   */
  const [sets, setSets] = useState(null);

  var blocksAreChosen = "blocks-week-" + week + "-set" in window.localStorage;
  if (blocksAreChosen) {
    var blocksOfWeek = JSON.parse(
      window.localStorage.getItem("blocks-week-" + week)
    );
    // they would look like [{push: OBJECT, pull: OBJECT}, {push: OBJECT, pull: OBJECT}]

    for (var blocknum = 1; blocknum <= blocks; blocknum++) {
      /**
       * Set up the timer and set counter
       */
      (function (blocknum) {
        function updateSets(exercises, block, count) {
          var copy = {};
          Object.assign(copy, sets); //there are actually reps here!!!

          var stringOfExercises = "";
          Object.entries(exercises).map(([type, exercise]) => {
            stringOfExercises = stringOfExercises + "+" + exercise.id; 
          })
          stringOfExercises = stringOfExercises.substring(1);
          //both exercises will be listed here
          copy[
            stringOfExercises + "-" + block
          ] = count;
          setSets(copy);
        }

        content.push({
          el: (
            <>
              <h3>
                Block {blocknum} of {blocks}
              </h3>
              <MovementTimer
                exercises={blocksOfWeek[blocknum - 1]}
                onDone={() => {}}
                onSetChange={updateSets}
                mins={7}
                countdownID={countdownID}
                block={blocknum}
              />
            </>
          ),
          rule: () => {
            return true;
          },
          previous: true,
          title: "Movement Block " + blocknum,
        });

        /**
         * Add countdown of 2 minutes in between blocks
         */
        if (blocknum != blocks)
          content.push({
            el: (
              <>
                <h3>Take a break! Breathe!</h3>
                <p>We recommend taking a 2-minute break between each block.</p>
                <p>If you wish to skip these, please press "Next".</p>
                <p>
                  The timer will reset after 2 minutes have passed, so you can
                  decide when to proceed to the next block by pressing "Next".
                </p>
                <div className="timer">
                  <CountdownCircleTimer
                    onComplete={() => {
                      return [true];
                    }}
                    isPlaying
                    size={90}
                    duration={120}
                    colors={[
                      ["#004777", 0.33],
                      ["#F7B801", 0.33],
                      ["#A30000", 0.33],
                    ]}
                  >
                    {({ remainingTime }) => remainingTime}
                  </CountdownCircleTimer>
                </div>
              </>
            ),
            rule: () => {
              return true;
            },
            next: true,
            previous: true,
            title: "2-minute break",
          });
      })(blocknum);
    }
  }

  /**
   * Heart Rate and effort review
   */
  const [postHeart, setPostHeart] = useState(null);

  content.push({
    el: (
      <>
        <h3>Post-Exercise Heart Rate</h3>
        <HeartRate
          onChange={(rate) => {
            // console.log("Set Heart Rate", rate);
            setPostHeart(rate);
          }}
        />
      </>
    ),
    rule: () => {
      return postHeart !== null;
    },
    title: "Post-exercise Heart Rate",
  });

  /**
   * Where did you do your minutes?
   */
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

  content.push({
    el: (
      <div className="minutesQues">
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
      </div>
    ),
    rule: () => {
      return variables.place != "" && variables.timeOfDay != "";
    },
    title: "Movement Questions",
  });

  /**
   * RPE
   */
  const [rpeVal, setrpeVal] = useState(1);
  const [scoreRPE, setscoreRPE] = useState("0-1: No Exertion");
  const [explanationRPE, setexplanationRPE] = useState(
    "The only movement you're getting is pushing buttons on the TV remote."
  );

  content.push({
    el: (
      <>
        <h3>Perceived Exertion</h3>
        <p>How do you feel?</p>
        <RPE
          onChange={async (rpeVal, scoreRPE, explanationRPE) => {
            setrpeVal(rpeVal);
            setscoreRPE(scoreRPE);
            setexplanationRPE(explanationRPE);
          }}
        />
      </>
    ),
    rule: () => {
      return true;
    },
    title: "Perceived Exertion Score",
  });

  /**
   * Notes
   */
  const [notes, setNotes] = useState("");
  content.push({
    el: (
      <>
        <h3>Notes</h3>
        <p>
          How did today's exercise go? Add some notes to remind yourself of
          which moves went well and which were more challenging.
        </p>
        <IonTextarea
          placeholder="Enter your note"
          onIonChange={(e) => {
            setNotes(e.detail.value);
          }}
        />
      </>
    ),
    rule: () => {
      return true;
    },
    title: "Record your Notes",
  });

  const history = useHistory();
  if (blocksAreChosen) {
    /**
     * Instructions and stage list
     */
    var rubric =
        "This week, you'll do the same exercises each day. You have " +
        blocks +
        " blocks to complete. Here is a breakdown of the strength tasks for today:";
    var snum = 1;
    content[0] = {
      el: (
        <>
          <p>{rubric}</p>
          <IonList>
            <IonListHeader>
              <IonLabel>Today's Strength Practice</IonLabel>
            </IonListHeader>
            {content.map((stage, i) => {
              if (stage.title)
                return (
                  <IonItem key={i}>
                    <span className="number" slot="start">
                      {snum++}
                    </span>{" "}
                    <IonLabel>{stage.title}</IonLabel>
                  </IonItem>
                );
            })}
          </IonList>
        </>
      ),
      rule: function () {
        return true;
      },
    };
  } else {
    content[0] = {
      el: (
        <>
          <h3>Blocks have not been set.</h3>
          <p>
            Before proceeding to today's strength exercise, please set this week's blocks under today's required tasks.
          </p>
          <IonButton onClick={() => history.push({
      pathname:
        "/box/move/"
    })}>Back to your Move box</IonButton>
        </>
      ),
      rule: function () {
        return false;
      },
    };
  }

  /**
   * Final stage, save button!
   */
  content.push({
    el: (
      <>
        <h3>Good work!</h3>
        <p>Submit your workout to record your progress.</p>
        <p>
          <strong>See you tomorrow!</strong>
        </p>
        <IonButton
          onClick={function () {
            var res = {};
            res.sets = sets; // Contains exercises and number of sets
            res.preHeartrate = preHeart;
            res.heartrate = postHeart; // Contains heart rate
            res.exertionValue = scoreRPE; //contains the string of exertion type
            res.type = "strength";
            var rmins = {};
            rmins.type = "minutes";
            rmins.minutes = week > 6 ? 35 : Math.max(1, week - 1) * 7;
            rmins.location = variables.place;
            rmins.time = variables.timeOfDay;
            var rnotes = {};
            rnotes.type = "note";
            rnotes.note = notes;
            notes.length > 0
              ? onSubmit([res, rmins, rnotes])
              : onSubmit([res, rmins]);
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
      // console.log("Stage", i, "is not complete");
      break;
    }
  }

  // console.log("Max stage is", maxStage, "of", content.length);

  // Wrap all the content into slides, with next buttons
  var slides = [];

  var nextSlide = () => {
    setStage(stage + 1);
  };

  var prevSlide = () => {
    setStage(stage - 1);
  };

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

  var slide = slides[Math.min(stage, maxStage)];

  return <div className="StrengthWizard">{slide}</div>;
};

export default StrengthWizard;
