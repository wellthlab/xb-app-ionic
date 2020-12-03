import React, { Component, useState } from 'react';
import { IonButton, IonContent, IonAlert, IonPage, IonModal } from '@ionic/react';

function FunctionalityAlert(props) {

    if (!props.showAlert) {
        return null;
    };
    return <div>
        <IonAlert
            isOpen={props.showAlert}
            onDidDismiss={props.toggleAlert}
            cssClass='my-custom-class'
            header={'Info'}
            message={'We are really sorry, this side of the application is not ready yet. We will let you know soon of future updates. :)'}
            buttons={['OK']}
        />

    </div>;
}


export default FunctionalityAlert;
