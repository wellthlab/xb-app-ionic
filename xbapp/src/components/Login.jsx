import React, {Component} from 'react';
import { connect } from 'react-redux'
import {ActionLogin} from '../model/actions/ActionLogin'
import { IonContent, IonButton, IonModal, IonItem, IonInput, IonCard } from '@ionic/react';

const autoBindReact = require('auto-bind/react');

class Login extends Component{
    constructor(props) {
        super(props);
        autoBindReact(this);
    }

    render(){
        const {account} = this.props;

        if(account.loggedin) {
            return(
                <IonContent>
                <p>You are logged in as {account.email}</p>
                </IonContent>
            );
        } else {
            return(
                <IonContent>
                    <p style={{textAlign: "center", margin: "70px 0 70px 0"}}><img src="assets/xb-logotype.png" alt="XB Logo" /></p>
                    <IonCard>
                    <IonItem>
                        <IonInput value="" placeholder="Email Address" type="email" onIonChange={(e)=>{this.email = e.detail.value}}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonInput value="" placeholder="Password" type="password" onIonChange={(e)=>{this.password = e.detail.value}}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonButton onclick={this.login} slot="end">Log In</IonButton>
                    </IonItem>
                    </IonCard>
                    <p style={{textAlign: "center", margin: "20px 0 20px 0"}}>or</p>
                    <IonCard>
                        <IonButton onclick={this.register}>Register</IonButton>
                    </IonCard>
                </IonContent>
            );
        }
    }

    login(e) {
        this.props.ActionLogin(this.email, this.password);
    }
}

export default connect(
    (state, ownProps) => {
        return {account: state.account};
    },
    { // Actions to include as props
        ActionLogin
    }

)(Login);
