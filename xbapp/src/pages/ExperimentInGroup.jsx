import React, { Component, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonInput, IonButton } from '@ionic/react';
import XBHeader from '../components/XBHeader'

import { connect } from 'react-redux'
const autoBindReact = require('auto-bind/react');
//after clicking submit, it should retrieve the experiment that the group is doing and adds it to the list
const ExperimentInGroup = () => {

    const [number, setNumber] = useState();
    return (
        <IonPage>
            <XBHeader title="Join a Group"></XBHeader>
            <IonContent>
                <p style={{ textAlign: "center", margin: "20px 0 20px 0" }}>Please write the Team ID in the box below and press Submit.</p>
                <div className="centering">
                    <IonInput type="number" value={number} placeholder="Enter Number" onIonChange={e => setNumber(parseInt(e.detail.value, 10))}></IonInput>
                </div>

                <div className="centering">
                    <IonButton onClick={() => alert(number)} routerLink="/group">SUBMIT</IonButton>
                    
                </div>

            </IonContent>
        </IonPage>
    );
};
export default ExperimentInGroup;
