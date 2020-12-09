import React, { Component, useState } from 'react';
import { connect } from 'react-redux'
import { ACCEPT_LOGIN } from '../model/slices/Account'
import { IonContent, IonButton, IonItem, IonInput, IonCard, IonItemDivider } from '@ionic/react';

import getXBClient from '../model/client';
import XBHeader from '../components/XBHeader'
import "./Register.scss";
import { useHistory } from "react-router-dom";

import { NavContext } from '@ionic/react';
import GenericModal from "../components/GenericModal";
import PIS from "../components/PIS";

const autoBindReact = require('auto-bind/react');

const Register = ({ ACCEPT_LOGIN }) => {


    const [state1, setState] = useState({ eml: "", pw: "", pw2: "", error: false });
    const history = useHistory();

    const [showModal, setShowModal] = useState(false);
    function toggleModal() { setShowModal(!showModal) }

    var err = "";
    var btn = "";

    console.log(ACCEPT_LOGIN);

    if (state1.pw.length < 8) {
        err = <>Enter a password of at least 8 characters</>
    } else if (state1.pw !== state1.pw2) {
        err = <>Enter your password again</>
    } else if (state1.eml.length > 5) {
        err = "";
        btn = <IonButton onclick={() => register()} slot="end">Register</IonButton>
    }

    if (err == "" && state1.error !== false) {

        switch (state1.error.statusCode) {
            case 409:
                err = <ion-text color="danger">That email address is already registered</ion-text>;
                break;
            default:
                err = <ion-text color="danger">{state1.error.error}</ion-text>;
        }


    }

    function register(e) {
        var client = getXBClient();
        var eml = state1.eml
        var pw = state1.pw
        client.register(eml, pw).then(
            (user) => {
                ACCEPT_LOGIN({ email: eml, password: pw });
            }, (err) => {
                setState({ error: err });
            }
        );
    }

    var pis = <PIS/>

    return (
        <IonContent>
            <GenericModal showModal={showModal} toggleModal={toggleModal} title={"Participant Information Sheet"} message={pis} />

            <IonCard>
                <IonItem>
                    <IonInput placeholder="Email Address" type="email" onIonChange={(e) => { setState({ eml: e.detail.value, pw: state1.pw, pw2: state1.pw2, error: state1.error }) }}></IonInput>
                </IonItem>
                <IonItem>
                    <IonInput placeholder="Password" type="password" onIonChange={(e) => { setState({ eml: state1.eml, pw: e.detail.value, pw2: state1.pw2, error: state1.error }) }}></IonInput>
                </IonItem>
                <IonItem>
                    <IonInput placeholder="Confirm Password" type="password" onIonChange={(e) => { setState({ eml: state1.eml, pw: state1.pw, pw2: e.detail.value, error: state1.error }) }}></IonInput>
                </IonItem>
                <IonItem>
                    {err}
                </IonItem>

            </IonCard>
            <p>Please read the information at the link below. Please note that by registering and creating an account, you agree to have read the information about the study and agree for your data being used anonymously for the purpose of this study.</p>
            <a href="javascript:void(0)" onClick={() => { toggleModal() }}>Read Information Sheet About Our Study</a>

            <IonItemDivider></IonItemDivider>
            <div className="centering">
                {btn}
            </div>
            <div className="centering">
                <IonButton routerLink="/" onClick={() => { history.push("/"); window.location.reload(); }}>Go back</IonButton>
            </div>

        </IonContent>
    );




}

export default connect(
    (state, ownProps) => {
        return { account: state.account };
    },
    { // Actions to include as props
        ACCEPT_LOGIN,
    }

)(Register);
