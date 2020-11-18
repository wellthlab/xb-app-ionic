import { IonButton, IonContent, IonHeader, IonPage } from '@ionic/react';
import React from 'react';
import XBHeader from '../components/XBHeader'
import './LoginAfter.css';

const LoginAfter: React.FC = () => {
            console.log("Render welcome");
    return (
        <IonPage>
            <XBHeader title="Welcome to XB"></XBHeader>
            <IonContent>
                <p>(Something about hello, it's all very exciting, you should start an experiment)</p>
            </IonContent>
        </IonPage>
    );
};

export default LoginAfter;
