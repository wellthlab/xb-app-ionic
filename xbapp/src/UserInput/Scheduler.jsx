import {
  IonBackButton,
  IonButton,
  IonLabel,
  IonCheckbox,
  IonHeader,
  IonPage,
  IonTitle,
} from "@ionic/react";
import React, { Component } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";


const Scheduler = (props) => {
  useEffect(() => {}, []);
  const history = useHistory();

  const [checled1, isChecked1] = React.useState(false);
  const [checled2, isChecked2] = React.useState(false);
  const [checled3, isChecked3] = React.useState(false);
  const [checled4, isChecked4] = React.useState(false);
  //expecting week to be passed as prop
  let week = props.week;

  const [checkers, setCheckers] = React.useState(props.daysCalendar);

  const [areChecked, setAllChecked] = React.useState(false);

  function submit() {

    var responseString ="Set a workout in the clanedar for ";
    checkers.map((eachDay, key) => {
      responseString = responseString + eachDay.day + "; ";
    })
    
    var response = {};
    response.type = "scheduler";
    response.scheduling = responseString;

    props.onSubmit(response);
  }

  function areAllChecked(){
    var areAllChecked = true;
    checkers.map((eachDay, key) => {
      if (eachDay.isChecked == false) areAllChecked = false;
    })
    setAllChecked(areAllChecked);
  }
  return (
   <><p>Please schedule your workouts in the calendar for the following days (7 minutes). Tick the days when done.</p>

   {checkers.map((dayEntry, key) => <div key={key}>
    <IonCheckbox checked={checkers[key].isChecked} onIonChange={e => {
          var oldCheckers = checkers;
          oldCheckers[key].isChecked = !oldCheckers[key].isChecked;
          setCheckers(oldCheckers);
          areAllChecked();
          }} />
          <IonLabel>{dayEntry.day}</IonLabel>
          <br></br>
        
   </div>)}
   {/* <IonLabel>Tuesday</IonLabel>
   <IonCheckbox checked={checled1} onIonChange={e => isChecked1(e.detail.checked)} />

   <IonLabel>Wednesday</IonLabel>
   <IonCheckbox checked={checled2} onIonChange={e => isChecked2(e.detail.checked)} />

   <IonLabel>Thursday</IonLabel>
   <IonCheckbox checked={checled3} onIonChange={e => isChecked3(e.detail.checked)} />

   <IonLabel>Friday</IonLabel>
   <IonCheckbox checked={checled4} onIonChange={e => isChecked4(e.detail.checked)} /> */}

  {areChecked? <IonButton onClick={submit}>Finished</IonButton> : <></>}
   {/* {checled1 && checled2 && checled3 && checled4 ? <IonButton onClick={submit}>Finished</IonButton> : <></>} */}


   </>
   
  

  );
};

export default Scheduler;
