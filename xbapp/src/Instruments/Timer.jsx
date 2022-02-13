import React, { useState, useEffect } from "react";
import { IonButton, IonItem, IonIcon } from "@ionic/react";
import "./Timer.scss";
import { connect } from "react-redux";

import { refreshOutline, playOutline, pauseOutline } from "ionicons/icons";

function Timer(props) {
  const [seconds, setSeconds] = useState(
    localStorage.getItem("timerStartedAt") != null
      ? parseInt(localStorage.getItem("timerStartedAt")) != 0
        ? differenceBetweenThenAndNow("seconds")
        : parseInt(localStorage.getItem("recordedSeconds"))
      : 0
  );
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
      localStorage.setItem("locationOfTimer", window.location.pathname);
    } else {
      //about to be paused
      localStorage.setItem("timerStartedAt", 0);
      localStorage.setItem("recordedSeconds", seconds);
      localStorage.setItem("recordedMinutes", minutes);
      localStorage.setItem("recordedHours", hours);

      var secondsToUse = hours * 3600 + minutes * 60 + seconds;
      localStorage.setItem("time", secondsToUse);
      if (props.onStop) {
        props.onStop(secondsToUse / 60);
      }
      if(props.onPause) {
        props.onPause(secondsToUse / 60);
      }
    }
    setIsActive(!isActive);
  }

  function reset() {
    resetTimer(); // Clear localStorage

    setSeconds(0);
    setMinutes(0);
    setHours(0);
    setIsActive(false);
  }

  var [isReset, setIsReset] = useState(false);

  if(!isReset) {
    setIsReset(true);
    reset();
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

  var buttonsOnShow = true;
  // console.log("buttonsOnShow", props.buttonsOnShow);
  if (typeof props.buttonsOnShow == "undefined") {
    buttonsOnShow = true;
  } else {
    buttonsOnShow = props.buttonsOnShow;
  }

  return (
    <div>
      <div className="time">
        {hours < 1 ? "" : (hours > 9 ? hours : "0" + hours) + ":"}
        {minutes > 9 ? minutes : "0" + minutes}:
        {seconds > 9 ? seconds : "0" + seconds}
      </div>
      {buttonsOnShow ? (
        <div className="row" style={{textAlign: "center"}}>
          <IonButton onClick={toggle}><IonIcon icon={isActive ? pauseOutline : playOutline} /></IonButton>
          <IonButton onClick={reset}><IonIcon icon={refreshOutline} /></IonButton>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

function resetTimer() {
  localStorage.removeItem("recordedSeconds");
  localStorage.removeItem("recordedMinutes");
  localStorage.removeItem("recordedHours");
  localStorage.removeItem("countActive");
  localStorage.removeItem("timerStartedAt");
}

export default Timer;

export { resetTimer };
