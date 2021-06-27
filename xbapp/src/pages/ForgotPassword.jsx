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
                Forgot Password
              </IonButton>
            </div>

            <div className="centering"><IonButton routerLink={"/"}> Home </IonButton></div>
          </>
        );
      }

      return (
        <IonContent>
          <div id="forgot-password">
            <img src="assets/strength_logo.png" alt="XB Logo" />
            {form}
          </div>
        </IonContent>
      );
    }
  }
  // Sends a password reset request to server
  // TODO: send feedback to user about state of password reset request
  forgotPassword(e) {
    console.log("Send password reset request");
    const client = getXBClient();
    client.forgotPassword(this.email);
  };
  // Verifies that email is in a valid format. Returns codes?
  isValidEmail(email) {
    console.log("This email looks great");
    return true;
  };

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
)(addControllersProp(ForgotPassword));
