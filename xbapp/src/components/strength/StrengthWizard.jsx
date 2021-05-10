/**
 * The Strength input widget steps people through the daily strength routine
 * and returns data about the workout
 *
 */
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
import { connect } from "react-redux";

import MovementPicker, { getMove } from "./MovementPicker";
import MovementInfoCard from "./MovementInfoCard";
import MovementTimer from "./MovementTimer";
import HeartRate from "./HeartRate";
import LevelFinder from "./LevelFinder";
import RPE from "../user_input/RPE";
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

/**
 * props:
 *      week: int - Week number; just used to store/retrieve chosen movement
 *
 */
const StrengthWizard = ({ week, onSubmit, countdownID }) => {
  const [stage, setStage] = useState(0);

  var blocks = Math.max(1, week - 1);
  // console.log("Week", week, "blocks", blocks);

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
            // console.log("Set Heart Rate", rate);
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
   * Set up the exercise picker
   */

  // TODO: We need to not jump to "you've picked" when the ex list is updated :/
  // Remember appropriate flow somehow? i.e. in a useState?

  var exList = [];
  var setExList = [];
  [exList[1], setExList[1]] = useLocalStorage(
    "week" + week + "-block1-exlist",
    []
  );
  [exList[2], setExList[2]] = useLocalStorage(
    "week" + week + "-block2-exlist",
    []
  );
  [exList[3], setExList[3]] = useLocalStorage(
    "week" + week + "-block3-exlist",
    []
  );
  [exList[4], setExList[4]] = useLocalStorage(
    "week" + week + "-block4-exlist",
    []
  );
  [exList[5], setExList[5]] = useLocalStorage(
    "week" + week + "-block5-exlist",
    []
  );
  [exList[6], setExList[6]] = useLocalStorage(
    "week" + week + "-block6-exlist",
    []
  );
  [exList[7], setExList[7]] = useLocalStorage(
    "week" + week + "-block7-exlist",
    []
  );

  // console.log("exList[1]", exList[1], exList[1].length);

  // Remember which flow is in use for each block
  var blockFlow = [];
  var setBlockFlow = [];
  [blockFlow[1], setBlockFlow[1]] = useState(
    exList[1].length < 2 ? "pick" : "show"
  );
  [blockFlow[2], setBlockFlow[2]] = useState(
    exList[2].length < 2 ? "pick" : "show"
  );
  [blockFlow[3], setBlockFlow[3]] = useState(
    exList[3].length < 2 ? "pick" : "show"
  );
  [blockFlow[4], setBlockFlow[4]] = useState(
    exList[4].length < 2 ? "pick" : "show"
  );
  [blockFlow[5], setBlockFlow[5]] = useState(
    exList[5].length < 2 ? "pick" : "show"
  );
  [blockFlow[6], setBlockFlow[6]] = useState(
    exList[6].length < 2 ? "pick" : "show"
  );
  [blockFlow[7], setBlockFlow[7]] = useState(
    exList[7].length < 2 ? "pick" : "show"
  );

  var [exExpList, setExExpList] = useState([]); // Explore exercise list, week 1

  //var [exList, setExList] = useState([]);
  const [sets, setSets] = useState(null);

  /**
   * Normal flow is to pick two moves and do them
   */
  if (week > 1) {
    // TODO: Only if exercise is not set; otherwise show a reminder?
    for (var blocknum = 1; blocknum <= blocks; blocknum++) {
      var picked = blockFlow[blocknum] == "show";
      // console.log("Block", blocknum, "List", exList[blocknum], "flow", blockFlow[blocknum])

      if (!picked) {
        // Either show a picker, or a reminder
        // console.log("Use picker for block", blocknum);
        (function (
          blocknum // Trap blocknum in a closure
        ) {
          content.push({
            el: (
              <>
                <h3>
                  Block {blocknum} of {blocks}
                </h3>
                <p>
                  You need to choose two movements for this block. Your choices
                  will be fixed for the rest of the week.
                </p>
                {week == 4 && blocknum < 3 ? (
                  <p>
                    You may prefer choosing either one <span>push</span>{" "}
                    movement and one <span>pull</span> movement, OR the{" "}
                    <span>same</span> isolateral movement (and switch sides).
                  </p>
                ) : (
                  <p>
                    Please select one <span>push</span> movement and one{" "}
                    <span>pull</span> movement.
                  </p>
                )}
                <p>
                  <strong>
                    Swipe left or right to select different moves.
                  </strong>
                </p>
                <MovementPicker
                  onChange={(list) => {
                    setExList[blocknum](list);
                  }}
                  number={2}
                  week={week}
                  blocknum={blocknum}
                />
              </>
            ),
            rule: function () {
              // console.log("Check exList for block", blocknum, exList[blocknum]);
              return exList[blocknum].length == 2;
            },
          });
        })(blocknum); // Apply value to closure
      }

      /**
       * Set up the timer and set counter
       */
      (function (blocknum) {
        function updateSets(type, block, count) {
          var copy = {};
          Object.assign(copy, sets);

          copy[type + "-" + block] = count;

          setSets(copy);
        }

        content.push({
          el: (
            <>
              <h3>
                Block {blocknum} of {blocks}
              </h3>
              <MovementTimer
                exercises={exList[blocknum]}
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
            title: "2-minute break",
          });
      })(blocknum);
    }

    /**
     * But in week 1, just explore different moves to find a level
     */
  } else {
    content.push({
      el: (
        <>
          <h3>Choose a Move</h3>
          <p>
            Please select the <span>push</span> movement you'd like to explore
            today.
          </p>
          <MovementPicker
            type="push"
            onChange={(list) => {
              // console.log("Set exercise list", list);
              setExExpList(list);
              var newsets = Object.assign({}, sets);
              newsets[list[0]] = "explore"; // Record the chosen exercise
              setSets(newsets);
              nextSlide();
            }}
            number={1}
            blocknum={0}
          />
        </>
      ),
      next: false,
      rule: function () {
        // console.log(exList);
        return exExpList.length == 1;
      },
      title: "Movement One",
    });

    content.push({
      el: <LevelFinder exercise={exExpList[0]} />,
      rule: () => {
        return true;
      },
      previous: true,
    });

    content.push({
      el: (
        <>
          <h3>Choose a Move</h3>
          <p>
            Please select the <span>pull</span> movement you'd like to explore
            today.
          </p>
          <MovementPicker
            type="pull"
            onChange={(list) => {
              // console.log("Set exercise list", list);
              setExExpList(list);
              var newsets = Object.assign({}, sets);
              newsets[list[0]] = "explore"; // Record the chosen exercise
              setSets(newsets);
              nextSlide();
            }}
            number={1}
            blocknum={0}
          />
        </>
      ),
      rule: function () {
        return exExpList.length == 1;
      },
      next: false,
      title: "Movement Two",
    });

    content.push({
      el: <LevelFinder exercise={exExpList[0]} />,
      rule: () => {
        return true;
      },
      previous: true,
    });
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
    title: "Record Notes",
  });

  /**
   * Instructions and stage list
   */
  if (week <= 1) {
    var rubric =
      "This week, you're exploring the different moves. Pick one upper and lower body move each day and try them out. ";
  } else {
    var rubric =
      "This week, you'll do the same exercises each day. You have " +
      blocks +
      " blocks to complete, with two moves in each block.";
  }

  var snum = 1;
  content[0] = {
    el: (
      <>
        <p>{rubric}</p>
        <IonList>
          <IonListHeader>
            <IonLabel>Today's Strength Exercise</IonLabel>
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
            rmins.minutes = Math.max(1, week - 1) * 7;
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
