import { IonButton, IonContent, IonAlert, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import XBHeader from '../components/XBHeader'
import './JourneyPlanner.scss';


const JourneyPlanner: React.FC = () => {

    const [showAlertExperimentYourself, setShowAlertExperimentYourself] = useState(false);

    return (
        <IonPage>
            <XBHeader title="Add an Experiment"></XBHeader>
            <IonContent>
                <img src="assets/health.png" alt="XB Health" />

                <p style={{ textAlign: "center", margin: "20px 0 20px 0" }}>Let's build some new skills! Please choose your new journey below!</p>
                <div className="centering">
                    <IonButton onClick={() => setShowAlertExperimentYourself(true)} >Start an Experiment</IonButton>
                </div>
                <div className="centering">
                    <IonButton routerLink="/experiment/group">Join a Team</IonButton>
                </div>
                <IonAlert
                    isOpen={showAlertExperimentYourself}
                    onDidDismiss={() => setShowAlertExperimentYourself(false)}
                    cssClass='my-custom-class'
                    header={'Info'}
                    subHeader={'Start an Experiment functionality'}
                    message={'We are really sorry, this side of the application is not ready yet. We will let you know soon of future updates. :)'}
                    buttons={['OK']}
                />

            </IonContent>
        </IonPage>
    );
};

export default JourneyPlanner;
