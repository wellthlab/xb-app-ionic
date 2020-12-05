import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton } from '@ionic/react';
import XBHeader from '../components/XBHeader'

import { addControllersProp } from '../model/controllers'
import { connect } from 'react-redux'

import './CreateTeam.scss'

const autoBindReact = require('auto-bind/react');

/**
 * Join an existing group
 * TODO: Rename this to be less ambiguous
 */
const CreateTeam = (props) => {

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [expid, setExpid] = useState("5fc7ae573d9aad4f4b3beaa9"); // Defaults to the four-week step challenge
    const [creating, setCreating] = useState(false); // Track if a create operation has been attempted

    function create(name, desc, expid){
        setCreating(true);
        props.controllers.CREATE_TEAM(name, desc, expid);
    }

    var content;

    // Detect completed joins and redirect
    if(creating && props.teams.creating === false && props.teams.create_err === false) {
        content = <>
            <div className="done">
                <h1><ion-icon name="checkmark-circle-outline"></ion-icon> Great!</h1>
                <p className="centering">You've created a new team! Let's get <strong>moving</strong>.</p>
                <p className="centering"><IonButton routerLink="/group">Go to Experiments</IonButton></p>
            </div>
            </>
    }
    else { // Otherwise show the entry interfae
        var btn, err;
        if(props.teams.creating) {
            btn = <ion-spinner name="crescent" />
        }
        else if(name.length > 3) {
            btn = <IonButton onClick={ () => { create(name, desc, expid) } } >Create Team</IonButton>;
        } else {
            btn = <></>
        }

        if(props.teams.join_err !== false) {
            err = <div className="centering"><ion-text color="danger">{props.teams.create_err}</ion-text></div>
        } else {
            err = <></>
        }

        content = <><p style={{ textAlign: "center", margin: "20px 0 20px 0" }}>Choose a name for your experiment, and optionally enter a description.</p>
        <div className="centering">
            <IonInput type="text" placeholder="Experiment Name (e.g. Jane's Movement Minutes)" onIonChange={e => { setName(e.detail.value)} }></IonInput>
            <IonInput type="text" placeholder="Experiment Description (e.g. The Finance Team get fit!)" onIonChange={e => { setDesc(e.detail.value)} }></IonInput>
        </div>
        {err}
        <div className="centering">
            {btn}
        </div></>
    }

    return (
        <IonPage className="creator">
            <XBHeader title="Create a Team"></XBHeader>
            <IonContent style={{paddingTop: '30px'}}>
                {content}
            </IonContent>
        </IonPage>
    );
};
export default connect(
    (state, ownProps) => {
      return {
        teams: state.teams,
        account: state.account
      }
    },
    {

    }

)(addControllersProp(CreateTeam));
