import React, { useState, useEffect } from 'react';
import {
    IonButton,
    IonRouterOutlet,
    IonMenu,
    IonToolbar,
    IonHeader,
    IonContent,
    IonList,
    IonItem,
    IonItemDivider,
    IonAlert
  } from '@ionic/react';
import './Timer.css';

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <div className="app">
      <div className="time">
        {seconds}s
      </div>
      <div className="row">
        <IonButton onClick={toggle}>
          {isActive ? 'Pause' : 'Start'}
        </IonButton>
        <IonButton onClick={reset}>
          Reset
        </IonButton>
      </div>
    </div>
  );
};

export default Timer;