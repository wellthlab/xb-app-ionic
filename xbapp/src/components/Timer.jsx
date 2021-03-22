import React, { useState, useEffect } from "react";
import { IonButton, IonItem } from "@ionic/react";
import "./Timer.scss";
import { connect } from "react-redux";

//we have the experiment/group ID, we have the day number to require update and we have the account
//=> can we update the day?
//need to handle the click of "submit" in both cases: when they use the timer or when they use an input field
function Timer(props) {
  const [seconds, setSeconds] = useState(
    localStorage.getItem("timerStartedAt") != null
      ? parseInt(localStorage.getItem("timerStartedAt")) != 0
        ? differenceBetweenThenAndNow("seconds")
        : parseInt(localStorage.getItem("recordedSeconds"))
      : 0
  );
  console.log(localStorage.getItem("timerStartedAt"), seconds);
  const [minutes, setMinutes] = useState(
    localStorage.getItem("timerStartedAt") != null
      ? parseInt(localStorage.getItem("timerStartedAt")) != 0
        ? differenceBetweenThenAndNow("minutes")
        : parseInt(localStorage.getItem("recordedMinutes"))
      : 0
  );
  const [hours, setHours] = useState(
    localStorage.getItem("timerStartedAt") != null
      ? parseInt(localStorage.getItem("timerStartedAt")) != 0
        ? differenceBetweenThenAndNow("hours")
        : parseInt(localStorage.getItem("recordedHours"))
      : 0
  );
  const [isActive, setIsActive] = useState(
    localStorage.getItem("countActive") != null
      ? localStorage.getItem("countActive") === "true"
      : false
  );

  function differenceBetweenThenAndNow(type) {
    const then = parseInt(localStorage.getItem("timerStartedAt"));
    const currentMillisecondsPassed = new Date().getTime() - then;
    const minutes = Math.floor(currentMillisecondsPassed / 60000);
    const hours = Math.floor(minutes / 60);
    const seconds = ((currentMillisecondsPassed % 60000) / 1000).toFixed(0);

    if (type == "seconds") {
      return parseInt(seconds);
    } else if (type == "minutes") {
      return parseInt(minutes);
    } else if (type == "hours") {
      return parseInt(hours);
    }
  }
  function toggle() {
    localStorage.setItem("countActive", !isActive);

    if (!isActive) {
      //is about to be turned on
      if (localStorage.getItem("timerStartedAt") != null) {
        if (parseInt(localStorage.getItem("timerStartedAt")) == 0) {
          const sec = parseInt(localStorage.getItem("recordedSeconds"));
          const min = parseInt(localStorage.getItem("recordedMinutes"));
          const hour = parseInt(localStorage.getItem("recordedHours"));
          //console.log(sec, min, hour);
          const millisec = (sec + min * 60 + hour * 3600) * 1000;
          //console.log(millisec);
          localStorage.setItem(
            "timerStartedAt",
            new Date().getTime() - millisec
          );
        }
      } else localStorage.setItem("timerStartedAt", new Date().getTime());
    } else {
      //about to be paused
      localStorage.setItem("timerStartedAt", 0);
      localStorage.setItem("recordedSeconds", seconds);
      localStorage.setItem("recordedMinutes", minutes);
      localStorage.setItem("recordedHours", hours);
    }
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
    localStorage.removeItem("recordedSeconds");
    setMinutes(0);
    localStorage.removeItem("recordedMinutes");
    setHours(0);
    localStorage.removeItem("recordedHours");
    setIsActive(false);
    localStorage.setItem("countActive", false);
    localStorage.removeItem("timerStartedAt");
  }

  function submit() {
    setSeconds(0);
    localStorage.removeItem("recordedSeconds");
    setMinutes(0);
    localStorage.removeItem("recordedMinutes");
    setHours(0);
    localStorage.removeItem("recordedHours");
    setIsActive(false);
    localStorage.setItem("countActive", false);
    localStorage.removeItem("timerStartedAt");
    localStorage.setItem("time", hours * 3600 + minutes * 60 + seconds);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds + 1 == 60) {
          localStorage.setItem("countMinutes", minutes + 1);
          setMinutes((minutes) => minutes + 1);
          if (minutes == 60) {
            localStorage.setItem("countHours", hours + 1);
            setHours((hours) => hours + 1);
            localStorage.setItem("countMinutes", 0);
            setMinutes(0);
          }
          setSeconds(0);
          localStorage.setItem("countSeconds", 0);
        } else {
          localStorage.setItem("countSeconds", seconds + 1);
          setSeconds((seconds) => seconds + 1);
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
        {hours > 9 ? hours : "0" + hours}:
        {minutes > 9 ? minutes : "0" + minutes}:
        {seconds > 9 ? seconds : "0" + seconds}
      </div>
      <div className="row">
        <IonButton onClick={toggle}>{isActive ? "Pause" : "Start"}</IonButton>
        <IonButton onClick={reset}>Reset</IonButton>
        <div></div>
        <IonButton onClick={submit}>Submit</IonButton>
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
}, {})(Timer);
