import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonItem,
  IonInput,
  IonRow,
  IonCol,
  IonGrid,
  IonIcon,
} from "@ionic/react";
import { refreshOutline, playOutline, pauseOutline } from "ionicons/icons";
import "./CountDown.scss";
import { connect } from "react-redux";

//sounds
import useSound from "use-sound";
import beep_short from "../util_audio/beep_short.mp3";
import beep_long from "../util_audio/beep_long.mp3";
import { toggleSharp } from "ionicons/icons";

/**
 * Props:
 *  onFinish - fired when countdown reaches zero
 *  onReset
 *  onPause
 *  minutes - starting number of minutes
 *  seconds - starting number of seconds
 *  active - set whether countdown is active initially
 */
function CountDown(props) {
  const [seconds, setSeconds] = useState(false);
  const [minutes, setMinutes] = useState(false);
  const [countdownisSet, setCountdownisSet] = useState(false);
  const [minutesToReturn, setMinutestoReturn] = useState(0);
  const [isActive, setIsActive] = useState(props.active ? props.active : false);

  if (seconds === false) {
    //we need to set the seconds and minutes
    if (localStorage.getItem("CountDownStartedAt") != null) {
      //checking if the countdown has been playing in the background
      if (parseInt(localStorage.getItem("CountDownStartedAt")) != 0) {
        //if it's been playing in the background, we need to update where it's left off
        var secondsToUpdate = differenceBetweenThenAndNow("seconds");
        setSeconds(secondsToUpdate);
        var minutesToUpdate = differenceBetweenThenAndNow("minutes");
        setMinutes(minutesToUpdate);
      } else {
        //it's been paused and left in the background - we retrieve the last number of seconds/mins
        var secondsToUpdate = parseInt(
          localStorage.getItem("CountDownrecordedSeconds")
        );
        setSeconds(secondsToUpdate);
        var minutesToUpdate = parseInt(
          localStorage.getItem("CountDownrecordedMinutes")
        );
        setMinutes(minutesToUpdate);
      }
    } else {
      setSeconds(props.seconds ? props.seconds : 0);
      setMinutes(props.minutes ? props.minutes : 0);
      localStorage.setItem("cdMinutesSet", props.seconds ? props.seconds : 0);
      localStorage.setItem("cdSecondsSet", props.minutes ? props.minutes : 0);
      //0
    }
    if (localStorage.getItem("CountDowncountActive") != null) {
      //if countdown is playing in the background
      var activeValue = localStorage.getItem("CountDowncountActive") === "true";
      setIsActive(activeValue);
    } else {
      setIsActive(props.active ? props.active : false);
      //false
    }

    // setMinutes(props.minutes ? props.minutes : 0);
    // setSeconds(props.seconds ? props.seconds : 0);
  }

  React.useMemo(() => {
    //whenever the timer is triggered (when the user presses on image)
    if (props.timerOn) toggle();
  }, [props.timerOn]);

  function toggle() {
    localStorage.setItem("CountDowncountActive", !isActive);

    if (!countdownisSet) {
      //prepare for returning number of minutes
      setMinutestoReturn(minutes);
      localStorage.setItem("cdMinutesSet", minutes);
      localStorage.setItem("cdSecondsSet", seconds);
      setCountdownisSet(true);
    }

    if (!isActive) {
      //is about to be turned on
      if (localStorage.getItem("CountDownStartedAt") != null) {
        //if it's been turned on before (i.e. START - pause - start)
        if (parseInt(localStorage.getItem("CountDownStartedAt")) == 0) {
          //if it's been paused and exited from the app and returned
          //then we need to update countdownStartedAt with a new time:
          //i.e. started at 20:15, paused at 20:20 and exited the app (countdownStartedAt = 20:15)
          //we press play again at 20:25, so "CountdownStartedAt" is updated to 20:20
          const sec = parseInt(
            localStorage.getItem("CountDownrecordedSeconds")
          );
          const min = parseInt(
            localStorage.getItem("CountDownrecordedMinutes")
          );
          //console.log(sec, min);
          const millisec = (sec + min * 60) * 1000;
          //console.log(millisec);
          localStorage.setItem(
            "CountDownStartedAt",
            new Date().getTime() - millisec
          );
        }
      } else localStorage.setItem("CountDownStartedAt", new Date().getTime()); //it's the first time it's been turned on
    } else {
      //about to be paused
      localStorage.setItem("CountDownStartedAt", 0);
      localStorage.setItem("CountDownrecordedSeconds", seconds);
      localStorage.setItem("CountDownrecordedMinutes", minutes);
    }

    setIsActive(!isActive);
  }

  function reset() {
    setMinutes(props.minutes ? props.minutes : 0);
    setSeconds(props.seconds ? props.seconds : 0);
    setIsActive(false);
    setCountdownisSet(false);
    setMinutestoReturn(0);
    localStorage.removeItem("cdMinutesSet");
    localStorage.removeItem("cdSecondsSet");

    localStorage.removeItem("CountDownrecordedSeconds");
    localStorage.removeItem("CountDownrecordedMinutes");
    setIsActive(false);
    localStorage.setItem("CountDowncountActive", false);
    localStorage.removeItem("CountDownStartedAt");

    if (props.resetTimer) props.resetTimer();
  }

  const [play_short] = useSound(beep_short);
  const [play_long] = useSound(beep_long);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds - 1 == -1) {
          localStorage.setItem("CountDownrecordedMinutes", minutes - 1);
          setMinutes((minutes) => minutes - 1);
          setSeconds(59);
          localStorage.setItem("CountDownrecordedSeconds", 59);
        } else {
          if (minutes == 0 && (seconds == 4 || seconds == 3 || seconds == 2)) {
            play_short();
          }
          if (minutes == 0 && seconds == 1) {
            play_long();
          }
          localStorage.setItem("CountDownrecordedSeconds", seconds - 1);
          setSeconds((seconds) => seconds - 1);
        }
        if (minutes == 0 && seconds == 0) {
          setIsActive(false);
          reset();
          if (props.onFinish) {
            props.onFinish(true);
          }
          if (props.onFinishMinutes) {
            props.onFinishMinutes(minutesToReturn);
          }
          localStorage.removeItem("cdMinutesSet");
          localStorage.removeItem("cdSecondsSet");
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <IonItem className="contain" lines="none">
      <IonGrid>
        <IonRow>
          {props.editable ? (
            <IonCol style={{ padding: "0px" }}>
              <div className="time0">
                <IonInput
                  style={{
                    width: "80px",
                    display: "inline-block",
                    marginRight: "10px",
                  }}
                  type="number"
                  value={minutes}
                  placeholder="0"
                  onIonChange={(e) => setMinutes(parseInt(e.detail.value, 10))}
                ></IonInput>
                :
                <IonInput
                  style={{
                    width: "80px",
                    display: "inline-block",
                    marginLeft: "10px",
                  }}
                  type="number"
                  value={seconds}
                  placeholder="0"
                  onIonChange={(e) => setSeconds(parseInt(e.detail.value, 10))}
                ></IonInput>
              </div>
            </IonCol>
          ) : (
            <IonCol style={{ padding: "0px" }}>
              <div className="time">
                {minutes > 9 ? minutes : "0" + minutes}:
                {seconds > 9 ? seconds : "0" + seconds}
              </div>
            </IonCol>
          )}
        </IonRow>
        <IonRow>
          <IonCol>
            {props.isExerciseTimer ? (
              localStorage.getItem("CountDownStartedAt") != null ? (
                <IonButton onClick={toggle} style={{ float: "right" }}>
                  <IonIcon icon={isActive ? pauseOutline : playOutline} />
                </IonButton>
              ) : (
                <></>
              )
            ) : (
              <IonButton onClick={toggle} style={{ float: "right" }}>
                <IonIcon icon={isActive ? pauseOutline : playOutline} />
              </IonButton>
            )}
          </IonCol>
          <IonCol>
            {props.isExerciseTimer ? (
              !isActive &&
              localStorage.getItem("CountDownStartedAt") != null ? (
                <IonButton
                  style={{
                    display: "inline-block",
                  }}
                  onClick={reset}
                >
                  <IonIcon icon={refreshOutline} />
                </IonButton>
              ) : (
                ""
              )
            ) : !isActive ? (
              <IonButton
                style={{
                  display: "inline-block",
                }}
                onClick={reset}
              >
                <IonIcon icon={refreshOutline} />
              </IonButton>
            ) : (
              ""
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );

  function differenceBetweenThenAndNow(type) {
    //what we SHOULD do is remove the number of from the original minutes and seconds the number that passed (then now)

    const then = parseInt(localStorage.getItem("CountDownStartedAt"));
    const currentMillisecondsPassed = new Date().getTime() - then;

    var minutesSetOnCountdown = parseInt(localStorage.getItem("cdMinutesSet"));
    var secondsSetOnCountdown = parseInt(localStorage.getItem("cdSecondsSet"));

    const countdownTotalMilliseconds =
      minutesSetOnCountdown * 60000 + secondsSetOnCountdown * 1000;
    //difference between total milliseconds and passed milliseconds
    const diff = countdownTotalMilliseconds - currentMillisecondsPassed;
    const minutesToUpdate = Math.floor(diff / 60000);
    const secondsToUpdate = ((diff % 60000) / 1000).toFixed(0);

    if (type == "seconds") {
      return parseInt(secondsToUpdate);
    } else if (type == "minutes") {
      return parseInt(minutesToUpdate);
    }
  }
}

export default connect((state, ownProps) => {
  return {
    account: state.account,
    teams: state.teams,
    boxes: state.boxes,
  };
}, {})(CountDown);
