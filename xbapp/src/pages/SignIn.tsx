import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './SignIn.css';

const SignIn: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Sign In Page</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen
                scrollEvents={true}
                onIonScrollStart={() => { }}
                onIonScroll={() => { }}
                onIonScrollEnd={() => { }}>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Blank</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <h1>button below to go to tabs (shall we keep tabs? or use side menu? tabs were a placeholder initially to get used to the environment...</h1>
                <IonButton color="primary"
                routerLink="/tabs"
                >take me to tabs</IonButton>
                <ExploreContainer name="Sign In Page" />
            </IonContent>
        </IonPage>
    );
};

export default SignIn;
