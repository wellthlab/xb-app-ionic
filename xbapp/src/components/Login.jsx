import React, { Component } from "react";
import { connect } from "react-redux";
import {
  START_LOGIN,
  ACCEPT_LOGIN,
  REJECT_LOGIN,
} from "../model/slices/Account";
import {
  IonContent,
  IonButton,
  IonItem,
  IonInput,
  IonCard,
  IonSpinner,
} from "@ionic/react";
import { Plugins, PushNotification, PushNotificationToken, PushNotificationActionPerformed } from '@capacitor/core';

import getXBClient from "../model/client";
import { addControllersProp } from "../model/controllers";

import "./Login.scss";
import CountDown from './CountDown';

const autoBindReact = require("auto-bind/react");

// const { PushNotifications } = Plugins;
// const INITIAL_STATE = {
//   notifications: [{ id: 'id', title: "Test Push", body: "This is my first push notification" }],
// };


class Login extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
    console.log("Login created with controllers", props.controllers);
    // this.state = { ...INITIAL_STATE };
  }

  // push(){
  //   // Register with Apple / Google to receive push via APNS/FCM
  //   PushNotifications.register();

  //   // On succcess, we should be able to receive notifications
  //   PushNotifications.addListener('registration',
  //     (token) => {
  //       alert('Push registration success, token: ' + token.value);
  //       console.log(token.value);
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
  //       //WE CAN ALERT IT INSIDE THE APP
  //       alert(notification.body);
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
  //       //open feed?
  //       let notif = this.state.notifications;
  //       notif.push({ id: notification.notification.data.id, title: notification.notification.data.title, body: notification.notification.data.body })
  //       this.setState({
  //         notifications: notif
  //       })
  //     }
  //   );
  // }
  
  render() {
      const { account } = this.props;
      // const { notifications } = this.state;

    if (window.localStorage.length != 0) {
      this.props.START_LOGIN({});
      this.props.ACCEPT_LOGIN({});
    }

    if (account.loggedin) {
      return (
        <IonContent>
          <p>You are logged in as {account.name}</p>
        </IonContent>
      );
    } else {
      var form;

      if (account.fetching) {
        form = <IonSpinner name="crescent" />;
      } else {
        form = (
          <>
            <IonCard>
              <IonItem>
                <IonInput
                  value=""
                  placeholder="Email Address"
                  type="email"
                  onIonChange={(e) => {
                    this.email = e.detail.value;
                  }}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonInput
                  value=""
                  placeholder="Password"
                  type="password"
                  onIonChange={(e) => {
                    this.password = e.detail.value;
                  }}
                ></IonInput>
              </IonItem>
            </IonCard>
            <div className="centering">
              <IonButton
                onclick={() => {
                  this.login();
                }}
                slot="end"
              >
                Log In
              </IonButton>
            </div>
          </>
        );
      }

      return (
        <IonContent>
          <br></br>
          <br></br>
          <img src="assets/box.png" alt="XB Logo" />
          {form}
          <p style={{ textAlign: "center", margin: "20px 0 20px 0" }}>
            Don't have an account?
          </p>
          <div className="centering">
            <IonButton routerLink="/register">Register</IonButton>
          </div>
          <ion-row style={{ height: "40px" }}></ion-row>
          <br></br>
          <br></br>
          <div className="tutorialButton">
            <IonButton routerLink="/tutorial" expand="full">
              What is XB? (Tutorial)
            </IonButton>
          </div>
          <CountDown></CountDown>
          {/* <IonButton expand="full" onClick={() => this.push()}>Register for Push</IonButton> */}
        </IonContent>
      );
    }
  }

  login(e) {
    if (!this.email || !this.password) {
      return;
    }

    this.props.START_LOGIN({});

    var client = getXBClient();
    client
      .setUser(this.email, this.password)
      .then((user) => {
        this.props.ACCEPT_LOGIN({ email: this.email, password: this.password });
      })
      .catch((err) => {
        console.log("Login rejected", err);
        console.log(err.message);
        this.props.REJECT_LOGIN(err.message);
      });
  }

  register(e) {}
}

export default connect(
  (state, ownProps) => {
    return { account: state.account };
  },
  {
    // Actions to include as props
    START_LOGIN,
    ACCEPT_LOGIN,
    REJECT_LOGIN,
    pure: false,
  }
)(addControllersProp(Login));
