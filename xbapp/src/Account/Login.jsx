import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  START_LOGIN,
  ACCEPT_LOGIN,
  REJECT_LOGIN,
} from "../util_model/slices/Account";
import {
  IonContent,
  IonButton,
  IonItem,
  IonInput,
  IonCard,
  IonSpinner,
} from "@ionic/react";

import getXBClient from "../util_model/client";
import { addControllersProp } from "../util_model/controllers";

import "./Login.scss";

const autoBindReact = require("auto-bind/react");

const Login = (props) => {
  var account = props.account;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (account.loggedin) {
    return (
      <IonContent>{/*<p>You are logged in as {account.name}</p>*/}</IonContent>
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
                placeholder="Email"
                type="email"
                onIonChange={(e) => {
                  setEmail(e.detail.value);
                }}
              />
            </IonItem>
            <IonItem>
              <IonInput
                placeholder="Password"
                type="password"
                onIonChange={(e) => {
                  setPassword(e.detail.value);
                }}
              />
            </IonItem>
          </IonCard>
          <div className="centering">
            <IonButton
              onclick={() => {
                login();
              }}
              slot="end"
            >
              Log In
            </IonButton>
          </div>
        </>
      );
    }

    function login(e) {
      if (!email || !password) {
        return;
      }

      props.START_LOGIN({});

      var client = getXBClient();
      client
        .setUser(email, password)
        .then((user) => {
          props.ACCEPT_LOGIN({ email: email, password: password });
        })
        .catch((err) => {
          props.REJECT_LOGIN(err.message);
        });
    }

    return (
      <IonContent>
        <div id="login">
          <img src="assets/strength_logo.png" alt="XB Logo" />
          {form}
          <div>
            <div className="centering">
              <Link to="/forgot-password">Forgotten password?</Link>
            </div>
            <h4>New to the app?</h4>
            <div className="centering">
              <IonButton routerLink="/register">Register</IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    );
  }
};

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
