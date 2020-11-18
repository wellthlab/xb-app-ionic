import React, { Component } from 'react';
import { connect } from 'react-redux'
import { LOG_IN } from '../model/slices/Account'
import { IonContent, IonButton, IonItem, IonInput, IonCard } from '@ionic/react';

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
            return (
                <IonContent>
                    <img src="assets/box.png" alt="XB Logo"/>
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
        this.props.LOG_IN({ email: this.email, password: this.password });
    }

    register(e) {

    }
}

export default connect(
    (state, ownProps) => {
        return { account: state.account };
    },
    { // Actions to include as props
        LOG_IN
    }

)(Login);
