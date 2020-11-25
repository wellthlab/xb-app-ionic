import { IonButton, IonContent, IonHeader, IonModal, IonPage } from '@ionic/react';
import React, {useState} from 'react';
import XBHeader from '../components/XBHeader'
import './JourneyPlanner.scss';

const JourneyPlanner: React.FC = () => {
    console.log("Render welcome");
    return (
        <IonPage>
            <XBHeader title="Journey Planner"></XBHeader>
            <IonContent>
                <img src="assets/health.png" alt="XB Health" />
                
                <p style={{ textAlign: "center", margin: "20px 0 20px 0" }}>Let's build some new skills! Please choose your new journey below!</p>
                <div className="centering">
                    <IonButton routerLink="/experiment/yourself">Start an Experiment</IonButton>
                </div>
                <div className="centering">
                    <IonButton routerLink="/experiment/group">Join a Team</IonButton>
                </div>

                
            </IonContent>
        </IonPage>
    );
};

export default JourneyPlanner;
