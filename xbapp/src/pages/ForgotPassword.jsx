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

import getXBClient from "../model/client";
import { addControllersProp } from "../model/controllers";

import "./ForgotPassword.scss";

const autoBindReact = require("auto-bind/react");

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
    console.log("ForgotPassword created with controllers", props.controllers);
  }

  componentDidMount() { }

  render() {
    const { account } = this.props;

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
                  placeholder="Email"
                  type="email"
                  onIonChange={(e) => {
                    this.email = e.detail.value;
                  }}
                ></IonInput>
              </IonItem>
            </IonCard>
            <div className="centering">
              <IonButton
                onclick={() => {
                  this.forgotPassword();
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
          <div id="login">
            <img src="assets/strength_logo.png" alt="XB Logo" />
            {form}
            <div>
              <IonButton onClick={() => {
                this.forgotPassword();
              }}>Forgotten password?</IonButton>
              <h4>New to the app?</h4>
              <div className="centering">
                <IonButton routerLink="/register">Register</IonButton>
                <IonButton routerLink="/tutorial">Tutorial</IonButton>
              </div>
            </div>
          </div>
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

  register(e) { }

  forgotPassword(e) {
    console.log("Reset password");
    const client = getXBClient();
    const email = this.email;
    const testEmail = "jds1g17@soton.ac.uk";
    console.log(email, testEmail)
    // client.forgotPassword(testEmail);
  }
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
)(addControllersProp(ForgotPassword));
