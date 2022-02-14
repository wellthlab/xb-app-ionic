import React, { useState, useEffect } from "react";
import { IonButton, IonItem, IonIcon } from "@ionic/react";
import "./Timer.scss";
import { connect } from "react-redux";

import { refreshOutline, playOutline, pauseOutline } from "ionicons/icons";

function StatelessTimer({showButtons, onPause}) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function toggle() {
    if (isActive) {
      if(onPause) {
        onPause(seconds / 60);
      }
    }
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds+1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  var buttonsOnShow = true;

  if (typeof showButtons == "undefined") {
    showButtons = true;
  }

  var rsecs = seconds % 60;
  var minutes = Math.floor((seconds % 3600) / 60);
  var hours = Math.floor(seconds / 3600);

  return (
    <div>
      <div className="time">
        {hours < 1 ? "" : (hours > 9 ? hours : "0" + hours) + ":"}
        {minutes > 9 ? minutes : "0" + minutes}:
        {rsecs > 9 ? rsecs : "0" + rsecs}
      </div>
      {showButtons ? (
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

export default StatelessTimer;
