import React, { useState, useEffect } from "react";
import { IonButton, IonItem } from "@ionic/react";
import "./CountDown.scss";
import { connect } from "react-redux";

//we have the experiment/group ID, we have the day number to require update and we have the account
//=> can we update the day?
//need to handle the click of "submit" in both cases: when they use the timer or when they use an input field
function CountDown(props) {
  const [seconds, setSeconds] = useState(
    localStorage.getItem("CountDownStartedAt") != null
      ? parseInt(localStorage.getItem("CountDownStartedAt")) != 0
        ? differenceBetweenThenAndNow("seconds")
        : parseInt(localStorage.getItem("CountDownrecordedSeconds"))
      : 0
  );

  const [minutes, setMinutes] = useState(
    localStorage.getItem("CountDownStartedAt") != null
      ? parseInt(localStorage.getItem("CountDownStartedAt")) != 0
        ? differenceBetweenThenAndNow("minutes")
        : parseInt(localStorage.getItem("CountDownrecordedMinutes"))
      : props.minutes
  );

  const [isActive, setIsActive] = useState(
    localStorage.getItem("CountDowncountActive") != null
      ? localStorage.getItem("CountDowncountActive") === "true"
      : false
  );

  function differenceBetweenThenAndNow(type) {
    const then = parseInt(localStorage.getItem("CountDownStartedAt"));
    const currentMillisecondsPassed = new Date().getTime() - then;
    const minutes = Math.floor(currentMillisecondsPassed / 60000);
    const seconds = ((currentMillisecondsPassed % 60000) / 1000).toFixed(0);

    if (type == "seconds") {
      return parseInt(seconds);
    } else if (type == "minutes") {
      return parseInt(minutes);
    }
  }
  function toggle() {
    localStorage.setItem("CountDowncountActive", !isActive);

    if (!isActive) {
      //is about to be turned on
      if (localStorage.getItem("CountDownStartedAt") != null) {
        if (parseInt(localStorage.getItem("CountDownStartedAt")) == 0) {
          const sec = parseInt(
            localStorage.getItem("CountDownrecordedSeconds")
          );
          const min = parseInt(
            localStorage.getItem("CountDownrecordedMinutes")
          );
          const millisec = (sec + min * 60) * 1000;
          localStorage.setItem(
            "CountDownStartedAt",
            new Date().getTime() - millisec
          );
        }
      } else localStorage.setItem("CountDownStartedAt", new Date().getTime());
    } else {
      //about to be paused
      localStorage.setItem("CountDownStartedAt", 0);
      localStorage.setItem("CountDownrecordedSeconds", seconds);
      localStorage.setItem("CountDownrecordedMinutes", minutes);
    }
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
    localStorage.removeItem("CountDownrecordedSeconds");
    setMinutes(props.minutes);
    localStorage.removeItem("CountDownrecordedMinutes");
    setIsActive(false);
    localStorage.setItem("CountDowncountActive", false);
    localStorage.removeItem("CountDownStartedAt");
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds - 1 == -1) {
          localStorage.setItem("CountDowncountMinutes", minutes - 1);
          setMinutes((minutes) => minutes - 1);
          setSeconds(59);
          localStorage.setItem("CountDowncountSeconds", 59);
        } else {
          localStorage.setItem("CountDowncountSeconds", seconds - 1);
          setSeconds((seconds) => seconds - 1);
        }
        if (minutes == 0 && seconds == 0) {
          setIsActive(false);
          reset();
          if (props.onFinish) {
            props.onFinish(true);
          }
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <div>
      <div className="time">
        {minutes > 9 ? minutes : "0" + minutes}:
        {seconds > 9 ? seconds : "0" + seconds}
      </div>
      <div className="row">
        <IonButton onClick={toggle}>{isActive ? "Pause" : "Start"}</IonButton>
        <div></div>
      </div>
    </div>
  );
}

export default connect((state, ownProps) => {
  return {
    account: state.account,
    teams: state.teams,
    boxes: state.boxes,
  };
}, {})(CountDown);
