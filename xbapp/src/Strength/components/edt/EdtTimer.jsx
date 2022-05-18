import React from "react";
import {
  IonRow,
  IonCard,
  IonGrid,
  IonCol,
  IonCardContent,
  IonText,
  IonItem,
  IonButton,
  useIonToast,
  IonIcon,
} from "@ionic/react";
import { barbellOutline } from "ionicons/icons";
import Blur from "react-css-blur";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import "./EdtTimer.scss";
import CountDown from "../../../Instruments/CountDown";
import MovementInfoCard from "../../MovementInfoCard";
import SetCounter from "../../SetCounter";

/**
 * Time movements
 */
const EdtTimer = ({
  isSnack,
  exercises,
  onSubmit,
  mins: minutes,
  secs,
  day,
  changeMoves,
}) => {
  if (!minutes) var minutes = 0;
  if (!secs) var secs = 0;

  const [moveAlternation, setMoveAlternation] = React.useState([null, null]);
  const [numberOfSets, setNumberOfSets] = React.useState(0);
  const [numberOfReps, setNumberOfReps] = React.useState(0);
  const [showReps, setShowReps] = React.useState(false);
  const [timerOn, setTimerOn] = React.useState(false);
  const [setToast, dismissSetToast] = useIonToast();

  function resetTimer() {
    setMoveAlternation([null, null]);
    setShowReps(false);
    setTimerOn(false);
  }

  function alternate(key) {
    let updated;
    if (moveAlternation[0] == null) {
      setNumberOfSets(0);
      updated = [false, false];
      updated[key] = true;
      setMoveAlternation(updated);
      setTimerOn(true);
      setShowReps(false);
    } else {
      updated = [!moveAlternation[0], !moveAlternation[1]];
      setMoveAlternation(updated);
      setNumberOfSets(numberOfSets + 1);
      setToast({
        color: "primary",
        message: "You've added 1 SET, keep going!",
        duration: 1500,
        buttons: [{ text: "OK", handler: dismissSetToast }],
      });
      onSubmit({
        minutes,
        sets: numberOfSets,
        reps: numberOfReps,
        exercises,
      });
    }
  }

  function timerFinished() {
    if (minutes !== 0 && secs !== 0) return;
    onSubmit({
      minutes,
      sets: numberOfSets,
      reps: numberOfReps,
      exercises,
    });
    setShowReps(true);
    setMoveAlternation([null, null]);
  }

  return (
    <IonCard id="movementTimer">
      <IonCardContent>
        {minutes === 0 && secs === 0 ? (
          ""
        ) : (
          <>
            {timerOn ? (
              <CountDown
                minutes={minutes}
                timerName={`day-${day}`}
                onFinish={() => {
                  timerFinished();
                }}
                timerOn={timerOn}
                resetTimer={resetTimer}
                isExerciseTimer={true}
              />
            ) : (
              ""
            )}
          </>
        )}

        <IonGrid>
          <IonRow>
            {Object.entries(exercises).length > 1 ? (
              Object.entries(exercises).map(([type, exercise], key) => (
                <IonCol
                  style={{
                    borderStyle:
                      moveAlternation[key] === false ? "hidden" : "solid",
                    borderRadius: "10px",
                    borderColor: "primary",
                    borderWidth: "1px",
                  }}
                  onClick={() => alternate(key)}
                >
                  <Blur
                    radius={moveAlternation[key] !== false ? "0px" : "5px"}
                    transition="400ms"
                  >
                    <div>
                      <MovementInfoCard
                        accordion={false}
                        titleSize={"small"}
                        key={exercise}
                        images={exercise.images}
                        name={exercise.name}
                      />
                    </div>
                  </Blur>
                </IonCol>
              ))
            ) : (
              <>
                <IonCol
                  style={{
                    borderStyle:
                      moveAlternation[0] === false ? "hidden" : "solid",
                    borderRadius: "10px",
                    borderColor: "primary",
                    borderWidth: "1px",
                  }}
                  onClick={() => alternate(0)}
                >
                  <Blur
                    radius={moveAlternation[0] !== false ? "0px" : "5px"}
                    transition="400ms"
                  >
                    <div>
                      <MovementInfoCard
                        accordion={false}
                        titleSize={"small"}
                        key={Object.entries(exercises)[0][1]}
                        images={Object.entries(exercises)[0][1].images}
                        name={`${
                          Object.entries(exercises)[0][1].name
                        } - left side`}
                      />
                    </div>
                  </Blur>
                </IonCol>
                <IonCol
                  style={{
                    borderStyle:
                      moveAlternation[1] === false ? "hidden" : "solid",
                    borderRadius: "10px",
                    borderColor: "primary",
                    borderWidth: "1px",
                  }}
                  onClick={() => alternate(1)}
                >
                  <Blur
                    radius={moveAlternation[1] !== false ? "0px" : "5px"}
                    transition="400ms"
                  >
                    <div>
                      <MovementInfoCard
                        accordion={false}
                        titleSize={"small"}
                        key={Object.entries(exercises)[0][1]}
                        images={Object.entries(exercises)[0][1].images}
                        name={`${
                          Object.entries(exercises)[0][1].name
                        } - right side`}
                      />
                    </div>
                  </Blur>
                </IonCol>
              </>
            )}
          </IonRow>
          {timerOn || isSnack ? (
            ""
          ) : (
            <IonRow>
              <IonCol>
                <br />
                <IonButton
                  expand="block"
                  onClick={changeMoves}
                  disabled={timerOn}
                >
                  <IonIcon icon={barbellOutline} slot="start" />
                  Choose moves
                </IonButton>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
        {showReps ? (
          <SetCounter
            showReps={showReps}
            sets={numberOfSets}
            onChange={(sets, reps) => {
              setNumberOfReps(reps);
              setNumberOfSets(sets);
              onSubmit({
                minutes,
                sets,
                reps,
                exercises,
              });
            }}
          />
        ) : (
          ""
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default EdtTimer;
