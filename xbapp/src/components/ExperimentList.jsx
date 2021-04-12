import React, { Component, useState } from "react";
import { IonButton, IonIcon, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, withIonLifeCycle, IonFooter, IonList, IonItem, IonLabel, IonListHeader, IonText } from "@ionic/react";
import { peopleOutline, alertOutline, todayOutline, add } from "ionicons/icons";
import { Link } from "react-router-dom";
import { Plugins, PushNotification, PushNotificationToken, PushNotificationActionPerformed } from '@capacitor/core';

// const { PushNotifications } = Plugins;
// const INITIAL_STATE = {
//   notifications: [{ id: 'id', title: "Test Push", body: "This is my first push notification" }],
// };

const ExperimentList = (props) => {
  const { teams } = props;

  //console.log("Render ExperimentList", props);

  // const push = () => {
  //   // Register with Apple / Google to receive push via APNS/FCM
  //   PushNotifications.register();

  //   // On succcess, we should be able to receive notifications
  //   PushNotifications.addListener('registration',
  //     (token) => {
  //       alert('Push registration success, token: ' + token.value);
  //     }
  //   );

  //   // Some issue with your setup and push will not work
  //   PushNotifications.addListener('registrationError',
  //     (error) => {
  //       alert('Error on registration: ' + JSON.stringify(error));
  //     }
  //   );

  //   // Show us the notification payload if the app is open on our device
  //   PushNotifications.addListener('pushNotificationReceived',
  //     (notification) => {
  //       let notif = this.state.notifications;
  //       notif.push({ id: notification.id, title: notification.title, body: notification.body })
  //       this.setState({
  //         notifications: notif
  //       })
  //     }
  //   );

  //   // Method called when tapping on a notification
  //   PushNotifications.addListener('pushNotificationActionPerformed',
  //     (notification) => {
  //       let notif = this.state.notifications;
  //       notif.push({ id: notification.notification.data.id, title: notification.notification.data.title, body: notification.notification.data.body })
  //       this.setState({
  //         notifications: notif
  //       })
  //     }
  //   );
  // }
  // const { notifications } = this.state;
  return (
    <>
      {teams.map((group, i) => {
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
            : "Day " + day;

        if (group.experiment.info === false) {
          return <p>This group has no experiment :(</p>;
        } else {
          return (
            <ion-card key={i}>
              <Link to={"/group/" + group._id}>
                <ion-card-header>
                  <ion-card-title>{group.name}</ion-card-title>
                  <ion-card-subtitle>
                    {group.experiment.info.title}
                  </ion-card-subtitle>
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
              </Link>
            </ion-card>
          );
        }
      })}
      {/* <IonButton expand="full" onClick={() => this.push()}>Register for Push</IonButton> */}
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <IonButton routerLink="/start">+</IonButton>
      </ion-fab>
    </>
  );
};
export default ExperimentList;
