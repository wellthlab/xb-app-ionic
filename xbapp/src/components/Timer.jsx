import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonItem,
  IonInput, IonContent, IonGrid, IonRow, IonCol, IonPage, IonHeader, IonToolbar, IonTitle
} from '@ionic/react';
import './Timer.scss';
import { connect } from 'react-redux'


//we have the experiment/group ID, we have the day number to require update and we have the account
//=> can we update the day?
//need to handle the click of "submit" in both cases: when they use the timer or when they use an input field
function Timer(props) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function toggle() {
    setIsActive(!isActive);
  }

  // var gid = props.match.params.id1; // Group ID comes from route
  // var group = false;


  // for (var g of props.teams.teams) { // Find the group in the store
  //   if (g._id == gid) {
  //     group = g;
  //   }
  // }


  // var experiment = group.experiment;

  // var last_experiment_day = experiment.info.duration;
  // var day_number = props.match.params.id2;


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
        <div >
          <div className="time">{seconds}s</div>
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

export default connect(
  (state, ownProps) => {
    return {
      account: state.account,
      teams: state.teams,
      boxes: state.boxes
    }
  },
  {

  }

)(Timer);
