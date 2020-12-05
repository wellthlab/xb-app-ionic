import React, { Component } from 'react';
import { connect } from 'react-redux'
import { START_LOGIN, ACCEPT_LOGIN, REJECT_LOGIN } from '../model/slices/Account'
import { IonContent, IonButton, IonItem, IonInput, IonCard, IonSpinner } from '@ionic/react';

import getXBClient from '../model/client';
import { addControllersProp } from '../model/controllers'

import "./Login.scss";

const autoBindReact = require('auto-bind/react');

class Login extends Component {
    constructor(props) {
        super(props);
        autoBindReact(this);
        console.log("Login created with controllers", props.controllers);
    }

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
                form = <IonSpinner name="crescent" />
            } else {
                form = <>
                    <IonCard>
                        <IonItem>
                            <IonInput value="" placeholder="Email Address" type="email" onIonChange={(e) => { this.email = e.detail.value }}></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonInput value="" placeholder="Password" type="password" onIonChange={(e) => { this.password = e.detail.value }}></IonInput>
                        </IonItem>
                    </IonCard>
                    <div className="centering">
                        <IonButton onclick={this.login} slot="end">Log In</IonButton>
                    </div>
                </>
            }

            return (
                <IonContent>
                    <img src="assets/box.png" alt="XB Logo" />
                    {form}
                    <p style={{ textAlign: "center", margin: "20px 0 20px 0" }}>Don't have an account?</p>
                    <div className="centering">
                        <IonButton routerLink="/register">Register</IonButton>
                    </div>
                    <ion-row style={{ height: "40px" }}></ion-row>
                    <br></br>
                    <br></br>
                    <p><a href="https://teams.microsoft.com/l/team/19%3a56457fd90cd84149b34600cf410a3ee8%40thread.tacv2/conversations?groupId=5fa041eb-4341-4608-a04a-67fa122429cc&tenantId=4a5378f9-29f4-4d3e-be89-669d03ada9d8" target="_blank">Part of the Movement Minute Challenge? Join the MS Teams Group!</a></p>
                    <br></br>
                    <br></br>
                    <div className="tutorialButton">
                        <IonButton routerLink="/tutorial" expand="full">What is XB? (Tutorial)</IonButton>
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
        client.setUser(this.email, this.password).then(
            (user) => {
                this.props.ACCEPT_LOGIN({ email: this.email, password: this.password })
            }, (err) => {
                this.props.REJECT_LOGIN(err.message)
            }
        );
    }

    register(e) {

    }
}

export default connect(
    (state, ownProps) => {
        return { account: state.account };
    },
    { // Actions to include as props
        START_LOGIN,
        ACCEPT_LOGIN,
        REJECT_LOGIN
    }

)(addControllersProp(Login));
