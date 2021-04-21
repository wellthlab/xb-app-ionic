import React, { Component, useState } from "react";
import {
  IonButton,
  IonIcon,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  withIonLifeCycle,
  IonFooter,
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonText,
  IonCard
} from "@ionic/react";
import { peopleOutline, alertOutline, todayOutline, add } from "ionicons/icons";
import { Link } from "react-router-dom";
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";

// const { PushNotifications } = Plugins;
// const INITIAL_STATE = {
//   notifications: [{ id: 'id', title: "Test Push", body: "This is my first push notification" }],
// };

const ExperimentList = (props) => {
  const { teams } = props;

  var steams = [...teams]; // Shallow copy teams so we can sort them

  steams.sort((a, b) => {
    return a.experiment.day - b.experiment.day;
  });

  return (
    <>
      {steams.map((group, i) => {
        var members = group.users.length;
        var missing = 0; // TODO: Look this up

        var memberchip;
        if (members > 1) {
          memberchip = (
            <ion-chip color="success">
              <ion-label>
                <IonIcon icon={peopleOutline} /> {members}
              </ion-label>
            </ion-chip>
          );
        } else {
          memberchip = (
            <ion-chip color="success">
              <ion-label>
                <IonIcon icon={peopleOutline} /> Private Experiment
              </ion-label>
            </ion-chip>
          );
        }

        var day = group.experiment.day;
        var daydesc =
          day == 0
            ? "Starts tomorrow"
            : day < 0
            ? "Starts in " + Math.abs(day) + " days"
            : day > group.experiment.info.duration
            ? "Finished"
            : "Day " + day;

        if (group.experiment.info === false) {
          return <p>This group has no experiment :(</p>;
        } else {
          return (
            <IonCard key={i} routerLink={"/group/" + group._id}>
                <ion-card-header>
                <ion-card-subtitle>
                  {group.experiment.info.title}
                </ion-card-subtitle>
                  <ion-card-title>{group.name}</ion-card-title>
                </ion-card-header>

                <ion-card-content>
                  <ion-chip color="primary">
                    <ion-label>
                      <IonIcon icon={todayOutline} /> {daydesc}
                    </ion-label>
                  </ion-chip>
                  {/*<ion-chip color="danger">
                                <ion-label><IonIcon icon={alertOutline} /> {missing} overdue { missing > 1 ? "entries" : "entry" }</ion-label>
                            </ion-chip>*/}
                  {memberchip}
                </ion-card-content>
            </IonCard>
          );
        }
      })}
      {/* <IonButton expand="full" onClick={() => this.push()}>Register for Push</IonButton> */}
    </>
  );
};
export default ExperimentList;
