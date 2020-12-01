import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonItem,
  IonInput
} from '@ionic/react';
import './Timer.css';
import { connect } from 'react-redux'

//we have the experiment/group ID, we have the day number to require update and we have the account
//=> can we update the day?
//need to handle the click of "submit" in both cases: when they use the timer or when they use an input field
const Timer = (props) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [number, setNumber] = useState();

  var group_id = props.match.params.id1;

  var experiment_object = findElement(props.groups.groups, "_group_id", group_id);
  var last_experiment_day = experiment_object["current_experiment"]["day"];
  var day_number = props.match.params.id2;

  function findElement(arr, propName, propValue) {
    for (var i = 0; i < arr.length; i++)
      if (arr[i][propName] == propValue)
        return arr[i];

  }

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
        <div className="row">
          <p><b>TIMER</b></p>
        </div>
      </div>
      {last_experiment_day = day_number ? <div>
        <div className="time">{seconds}s</div>
        <div className="row">
          <IonButton onClick={toggle}>
            {isActive ? 'Pause' : 'Start'}
          </IonButton>
          <IonButton onClick={reset}>
            Reset
        </IonButton>
        </div>
        <div className="row">
          <IonButton >
            Submit
        </IonButton>
        </div>
        <div className="row">
          <p>Or</p>
        </div>
      </div> : <div></div>}
      <div className="row">
        <p>Input a number of seconds below:</p>
        <IonItem>
          <IonInput type="number" value={number} placeholder="Enter: " onIonChange={e => setNumber(parseInt(e.detail.value, 1000))}></IonInput>
        </IonItem>
        <IonButton >
          Submit
        </IonButton>

      </div>
    </div>
  );
};

export default connect(
  (state, ownProps) => {
    return {
      account: state.account,
      groups: state.groups,
      boxes: state.boxes,
      days: state.coco
    }
  },
  {

  }

)(Timer);
