import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton } from '@ionic/react';
import XBHeader from '../components/XBHeader'

import { addControllersProp } from '../model/controllers'
import { connect } from 'react-redux'
const autoBindReact = require('auto-bind/react');


const ExperimentInGroup = (props) => {

    const [number, setNumber] = useState();

    function addTeam(code){
        console.log(code);
        props.controllers.JOIN_TEAM(code);
    }

    return (
        <IonPage>
            <XBHeader title="Join a Team"></XBHeader>
            <IonContent>
                <p style={{ textAlign: "center", margin: "20px 0 20px 0" }}>To join a team, you need to know the Team Code. Someone in the team can tell you what it is.</p>
                <div className="centering">
                    <IonInput type="text" placeholder="Enter your Team Code" onIonChange={e => { console.log(e); setNumber(e.detail.value)} }></IonInput>
                </div>

                <div className="centering">
                    <IonButton onClick={() => { addTeam(number) } } >Join Team</IonButton>
                </div>

            </IonContent>
        </IonPage>
    );
};
export default connect(
    (state, ownProps) => {
      return {
        account: state.account,
        groups: state.groups,
        boxes: state.boxes
      }
    },
    {

    }

)(addControllersProp(ExperimentInGroup));
