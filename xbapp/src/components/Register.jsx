import React, { Component, useContext } from 'react';
import { connect } from 'react-redux'
import { ACCEPT_LOGIN } from '../model/slices/Account'
import { IonContent, IonButton, IonItem, IonInput, IonCard, IonSpinner } from '@ionic/react';

import getXBClient from '../model/client';

import "./Register.scss";

import {NavContext} from '@ionic/react';

const autoBindReact = require('auto-bind/react');

class Register extends Component {
    constructor(props) {
        super(props);
        autoBindReact(this);

        this.state = {
            eml: '',
            pw: '',
            pw2: '',
            error: false
        }
    }

    render() {

        var err = "";
        var btn = "";

        console.log(this.state);

        if(this.state.pw.length < 8) {
            err = <>Enter a password of at least 8 characters</>
        } else if (this.state.pw !== this.state.pw2) {
            err = <>Enter your password again</>
        } else if(this.state.eml.length > 5) {
            err = "";
            btn = <IonButton onclick={this.register} slot="end">Register</IonButton>
        }

        if(err == "" && this.state.error !== false) {

            switch(this.state.error.statusCode) {
                case 409:
                    err = <ion-text color="danger">That email address is already registered</ion-text>;
                    break;
                default:
                    err = <ion-text color="danger">{this.state.error.error}</ion-text>;
            }


        }

        return (
            <IonContent>
                <IonCard>
                    <IonItem>
                        <IonInput  placeholder="Email Address" type="email" onIonChange={(e) => { this.setState({eml: e.detail.value}) }}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonInput  placeholder="Password" type="password" onIonChange={(e) => { this.setState({pw: e.detail.value}) }}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonInput  placeholder="Confirm Password" type="password" onIonChange={(e) => { this.setState({pw2: e.detail.value}) }}></IonInput>
                    </IonItem>
                    <IonItem>
                        {err}
                    </IonItem>
                </IonCard>
                <div className="centering">
                {btn}
                </div>
            </IonContent>
        );
    }

    register(e) {
        var client = getXBClient();
        var eml = this.state.eml
        var pw = this.state.pw
        client.register( eml, pw ).then(
            (user) => {
                this.props.ACCEPT_LOGIN({ email: eml, password: pw });
            }, (err) => {
                this.setState({error: err});
            }
        );
    }
}

export default connect(
    (state, ownProps) => {
        return { account: state.account };
    },
    { // Actions to include as props
        ACCEPT_LOGIN
    }

)(Register);
