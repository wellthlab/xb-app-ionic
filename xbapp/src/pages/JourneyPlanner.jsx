import { IonButton, IonContent, IonAlert, IonPage, IonModal } from '@ionic/react';
import React, { useState } from 'react';
import XBHeader from '../components/XBHeader'
import { connect } from 'react-redux'
import './JourneyPlanner.scss';
import Timer from '../components/Timer'
const JourneyPlanner = (account) => {

    return (
        <IonPage className="planner">
            <XBHeader title="Add an Experiment"></XBHeader>
            <IonContent>
                <img src="assets/health.png" alt="XB Health" />

                <h1 className="centering">Hello!</h1>
                <p className="centering">To get started you need to create a new Movement Minutes experiment, or join somebody else's!</p>

                <div className="centering">
                    <IonButton routerLink="/start/create" >Create a new Experiment</IonButton>
                    <p>(you can experiment by yourself, or invite other people to join in)</p>
                </div>
                <div className="centering">
                    <IonButton routerLink="/start/group" >Join Someone Else's Experiment</IonButton>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default connect(
    (state, ownProps) => {
        // A function to map parts of the global state (from the App's wrapper <Provider>)
        // into props for the wrapped component (which will be TabAccount)
        return {
            account: state.account
        }
    },
    {
        // A map full of action creators
        pure: false,
    }

)(JourneyPlanner);
