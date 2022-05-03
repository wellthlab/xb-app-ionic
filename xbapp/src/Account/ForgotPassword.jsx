import React, { Component } from "react";
import { connect } from "react-redux";
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

import "./ForgotPassword.scss";

const autoBindReact = require("auto-bind/react");

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
    // console.log("ForgotPassword created with controllers", props.controllers);
    this.state = {
      emailSent: false,
      err: <>Please enter your email</>,
    };
  }

  componentDidMount() {}

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
              <IonItem>{this.state.err}</IonItem>
            </IonCard>
            <div className="centering">
              <IonButton
                onclick={() => {
                  this.forgotPassword();
                }}
                disabled={this.state.emailSent}
                slot="end"
              >
                Forgot Password
              </IonButton>
            </div>

            <div className="centering">
              <IonButton routerLink={"/"}> Home </IonButton>
            </div>
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
  forgotPassword(e) {
    console.log("Send password reset request");
    const client = getXBClient();
    const email = this.email;
    this.setState({
      emailSent: true,
      err: <>Please enter your email</>,
    });
    client
      .forgotPassword(this.email)
      .then((success) => {
        if (success) {
          this.setState({
            emailSent: false,
            err: (
              <>
                Reset password link sent from {this.getResetEmail()} to {email},
                please check your junk folder
              </>
            ),
          });
          console.log("Email sent to", this.email);
        } else {
          this.setState({
            emailSent: false,
            err: <>Please enter a valid email</>,
          });
          console.log("Email not sent");
        }
      })
      .catch((err) => {
        console.log(err.message);
        this.setState({
          emailSent: false,
          err: <>There was a problem, try again later</>,
        });
      });
  }
  // Verifies that email is in a valid format. Returns codes?
  isValidEmail(email) {
    console.log("This email looks great");
    return true;
  }
  getResetEmail() {
    return "no-reply+stitch@mongodb.com";
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
