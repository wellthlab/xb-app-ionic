import React, { Component, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonDatetime,
  IonCheckbox,
  IonList,
  IonItemDivider,
  IonButton,
} from "@ionic/react";
import XBHeader from "../components/XBHeader";
import "./Account.css";
import GenericAlert from "../components/GenericAlert";
import GenericModal from "../components/GenericModal";
import mobiscroll from "@mobiscroll/react-lite";
import "@mobiscroll/react-lite/dist/css/mobiscroll.min.css";

import { LocalNotifications } from "@capacitor/local-notifications";
import * as moment from "moment";
import {format} from "date-fns"

const Notifications = ({}) => {
  const [chosenHours, setChosenHours] = useState(0);
  const [chosenMinutes, setChosenMinutes] = useState(0);

  const [days, setDays] = useState([
    { title: "Monday", dayCode: 1, checked: false },
    { title: "Tuesday", dayCode: 2, checked: false },
    { title: "Wednesday", dayCode: 3, checked: false },
    { title: "Thursday", dayCode: 4, checked: false },
    { title: "Friday", dayCode: 5, checked: false },
    { title: "Saturday", dayCode: 6, checked: false },
    { title: "Sunday", dayCode: 0, checked: false },
  ]);

  function setNewTime(e) {
    var time = e.detail.value;
    var processed_time = format(new Date(time), "HH:mm");
    setChosenHours(parseInt(processed_time.split(":")[0]));
    setChosenMinutes(parseInt(processed_time.split(":")[1]));
    //console.log(chosenHours, chosenMinutes);
  }

  function addNotifications() {
    let notif=[];
    let currentDate = new Date();
        let currentDay = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.

        for(let day of days){

            if(day.checked){
                // console.log(day.title);
                let firstNotificationTime = new Date();
                let dayDifference = day.dayCode - currentDay;

                if(dayDifference < 0){
                    dayDifference = dayDifference + 7; // for cases where the day is in the following week
                }

                // console.log(firstNotificationTime);
                firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));
                // console.log(firstNotificationTime);
                // console.log(chosenHours);
                firstNotificationTime.setHours(chosenHours);
                // console.log(firstNotificationTime);
                // console.log(firstNotificationTime.getHours());
                firstNotificationTime.setMinutes(chosenMinutes);

                let notification = {
                    id: day.dayCode,
                    title: day.title,
                    body: 'You just got notified :)',
                    at: firstNotificationTime,
                    // at: {
                    //           hour: 1,
                    //           minute: 15
                    // },
                    repeat: true,
                    every: 'week'
                };

                notif.push(notification);

            }

        }

        console.log("Notifications to be scheduled: ", notif);

            // Cancel any existing notifications
            //LocalNotifications.cancelAll().then(() => {

                // Schedule the new notifications
                LocalNotifications.schedule({
                  notifications: notif
                });

                notif = [];

                //alert('all good');

            // });
            

  }

  function updateChecked(checkedToUSe, dayCodeToUse){
    setDays(
      days.map(day => 
        day.dayCode === dayCodeToUse 
          ? {...day, checked : checkedToUSe} 
          : day 
    ))
  }

  function cancelAll() {

    //code for cancelling notifications
  LocalNotifications.getPending().then( res => {
    var index = res.notifications.map(x => {
      return x["id"];
    }).indexOf("10000000");
    res.notifications.splice(index, 0);
    LocalNotifications.cancel(res);
  }, err => {
    console.log(err);
  })

  }

  return (
    <IonPage>
      <XBHeader title="Notifications"></XBHeader>
      <IonContent id="about" fullscreen>
        <IonList no-lines>
          <IonItem>
            <IonLabel>Notify me at: </IonLabel>
            <IonDatetime
              displayFormat="h:mm A"
              minuteValues="0,15,30,45"
              pickerFormat="h mm A"
              onIonChange={(e) => {
                setNewTime(e);
              }}
            ></IonDatetime>
          </IonItem>

          <IonItem>
            <IonLabel>on the following days:</IonLabel>
          </IonItem>

          {days.map((day, i) => {
            return (
              <div key={day.dayCode}>
                <IonLabel>{day.title}</IonLabel>
                <IonCheckbox
                  checked={day.checked}
                  value={day.title}
                  color="primary"
                  onIonChange={(e) => updateChecked(e.detail.checked, day.dayCode)}
                ></IonCheckbox>
              </div>
            );
          })}
        </IonList>
        <IonItemDivider></IonItemDivider>
        <IonButton onClick={addNotifications} >Schedule</IonButton>
        <IonButton onClick={cancelAll} >Leave me alone!</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Notifications;
