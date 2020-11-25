import React, { Component } from 'react';
import { connect } from 'react-redux'
import { START_LOGIN, ACCEPT_LOGIN, REJECT_LOGIN } from '../model/slices/Account'
import { IonContent, IonButton, IonItem, IonInput, IonCard, IonSpinner } from '@ionic/react';

import getXBClient from '../model/client';

import "./Login.scss";

const autoBindReact = require('auto-bind/react');

class Login extends Component {
    constructor(props) {
        super(props);
        autoBindReact(this);
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

            if(account.fetching) {
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
                    <img src="assets/box.png" alt="XB Logo"/>
                    {form}
                    <p style={{ textAlign: "center", margin: "20px 0 20px 0" }}>Don't have an account?</p>
                    <div className="centering">
                    <IonButton routerLink="/register">Register</IonButton>
                    </div>
                    <ion-row style={{ height: "40px" }}></ion-row>
                    <div className="tutorialButton">
                        <IonButton routerLink="/tutorial" expand="full">What is XB? (Tutorial)</IonButton>
                    </div>
                </IonContent>
            );
        }
    }

    login(e) {

        if( !this.email || !this.password ) {
            return;
        }

        this.props.START_LOGIN({ });
        
        var client = getXBClient();
        client.setUser( this.email, this.password ).then(
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

)(Login);
