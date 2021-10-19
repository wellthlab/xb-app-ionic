import React, { useState, useEffect } from "react";
import { IonButton } from "@ionic/react";
import MovementPicker, { getMove } from "../DEPRECATED/components/OLDMovementPicker";
import MovementInfoCard from "./MovementInfoCard";
import LevelFinder from "./LevelFinder";
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
 * StrengthExercisePicker - to choose current movement, or change it
 */
const StrengthExercisePicker = ({ week, onSubmit, countdownID }) => {
  const [stage, setStage] = useState(0);

  var blocks = Math.max(1, week - 1);
  if (blocks > 5) blocks = 5;
  var content = [];

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
    for (var blocknum = 1; blocknum <= blocks; blocknum++) {
      var picked = blockFlow[blocknum] == "show";

      if (!picked) {
        // Either show a picker, or a reminder
        (function (
          blocknum // Trap blocknum in a closure
        ) {
          content.push({
            el: (
              <>
                <h2>Your CURRENT Exercise Choice</h2>
                <h3>
                  Block {blocknum} of {blocks}
                </h3>
                <p>
                  You need to choose two movements for this block. Your choices
                  will be fixed for the rest of the week.
                </p>
                {((week == 4 || week == 5) && blocknum < 3) || week == 6 ? (
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
                    if (list.length == 2) {
                      setBlockFlow[blocknum]("show");
                    }
                  }}
                  number={2}
                  week={week}
                  blocknum={blocknum}
                />
              </>
            ),
            rule: function () {
              return exList[blocknum].length == 2;
            },
            previous: true,
          });
        })(blocknum); // Apply value to closure
      } else {
        // console.log("Use reminder for block", blocknum);
        (function (
          blocknum // Trap blocknum in a closure
        ) {
          var move1 = getMove(exList[blocknum][0]);
          var move2 = getMove(exList[blocknum][1]);

          content.push({
            el: (
              <>
                <h2>Your CURRENT Exercise Choice</h2>
                <h3>
                  Block {blocknum} of {blocks}
                </h3>
                <p>
                  You have already chosen your exercises for this block. Here's
                  a reminder of what you picked.
                </p>
                {/* <p><strong>Swipe left or right to select different moves.</strong></p> */}

                <MovementInfoCard
                  titleSize={"normal"}
                  key={move1.id + "1"}
                  images={move1.images}
                  name={move1.name}
                />
                <MovementInfoCard
                  titleSize={"normal"}
                  key={move2.id + "2"}
                  images={move2.images}
                  name={move2.name}
                />
                <IonButton
                  onClick={() => {
                    setBlockFlow[blocknum]("pick");
                  }}
                >
                  Change your picks
                </IonButton>
              </>
            ),
            rule: function () {
              return exList[blocknum].length == 2;
            },
            previous: true,
          });
        })(blocknum); // Apply value to closure
      }
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
              //  console.log("Set exercise list", list);
              //list[0] is the push move
              setExExpList(list);

              nextSlide();
            }}
            number={0}
            blocknum={0} //no blocks
          />
        </>
      ),
      next: false,
      rule: function () {
        // console.log(exList);
        return true;
      },
      previous: true,
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
              //  console.log("Set exercise list", list);
              list[1] = list[0];
              list[0] = exExpList[0];
              console.log("SET", list);
              setExExpList(list);
              nextSlide();
            }}
            number={0}
            blocknum={0}
          />
        </>
      ),
      rule: function () {
        return true;
      },
      next: false,
      previous: true,
      title: "Movement Two",
    });

    content.push({
      el: <LevelFinder exercise={exExpList[1]} />,
      rule: () => {
        return true;
      },
      previous: true,
    });
  }

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
    // console.log("nexting");
    // console.log(blockFlow, blocknum);
    // console.log(blockFlow[blocknum]);
    setStage(stage + 1);
  };

  var prevSlide = () => {
    setStage(stage - 1);
  };

  for (var i in content) {
    var c = content[i];
    var nextExists = i < content.length - 1;
    var backExists = i - 1 >= 0;
    // console.log(i, nextExists, backExists);
    slides.push(
      <div key={"slide" + i}>
        {c.el}
        <div className="buttons">
          {backExists &&
          c.rule() &&
          (typeof c.previous == "undefined" || c.previous != false) ? (
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

export default StrengthExercisePicker;

// var exercisesAreSet = function (activeDay) {
//   var week = Math.floor((activeDay - 1) / 7) + 1;
//   var blocks = Math.max(1, week - 1);

//     for (var blocknum = 1; blocknum <= blocks; blocknum++) {
//       if (StrengthExercisePicker.blockFlow[blocknum] == "pick") return false;
//     }
//     return true;
// };

// export { exercisesAreSet };
