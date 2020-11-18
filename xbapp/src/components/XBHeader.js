import {IonHeader, IonTitle, IonToolbar, IonMenuButton, IonButtons } from '@ionic/react';
import React from 'react';

const XBHeader = (props) => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton></IonMenuButton>
                </IonButtons>
                <IonTitle>{props.title}</IonTitle>
            </IonToolbar>
        </IonHeader>
    );
};

export default XBHeader;
