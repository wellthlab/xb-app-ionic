import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonItem,
  IonInput,
  IonRow,
  IonCol,
  IonGrid,
} from "@ionic/react";
import "./CountDown.scss";
import { connect } from "react-redux";

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

  function toggle() {
    if (!countdownisSet) {
      setMinutestoReturn(minutes);
      setCountdownisSet(true);
    }
    setIsActive(!isActive);
  }

  function reset() {
    setMinutes(props.minutes ? props.minutes : 0);
    setSeconds(props.seconds ? props.seconds : 0);
    setIsActive(false);
    setCountdownisSet(false);
    setMinutestoReturn(0);
  }

  if (seconds === false) {
    setMinutes(props.minutes ? props.minutes : 0);
    setSeconds(props.seconds ? props.seconds : 0);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds - 1 == -1) {
          setMinutes((minutes) => minutes - 1);
          setSeconds(59);
        } else {
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
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  // console.log("countdown", minutes, seconds);

  return (
    <IonItem>
      <IonGrid>
        <IonRow>
          {props.editable ? (
            <div className="time">
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
          ) : (
            <div className="time">
              {minutes > 9 ? minutes : "0" + minutes}:
              {seconds > 9 ? seconds : "0" + seconds}
            </div>
          )}
        </IonRow>
        <IonRow>
          <div className="row">
            <IonButton onClick={toggle}>
              {isActive ? "Pause" : "Start"}
            </IonButton>
            {!isActive ? <IonButton onClick={reset}>Reset</IonButton> : ""}
          </div>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
}

export default connect((state, ownProps) => {
  return {
    account: state.account,
    teams: state.teams,
    boxes: state.boxes,
  };
}, {})(CountDown);
