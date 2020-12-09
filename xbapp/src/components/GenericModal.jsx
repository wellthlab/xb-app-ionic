import React, { Component, useState } from 'react';
import { IonButton, IonContent, IonAlert, IonPage, IonModal } from '@ionic/react';


function GenericModal(props) {

    if (!props.showModal) {
        return null;
    };
    return <div>
        <IonModal isOpen={props.showModal}>
        <IonContent>
            <br></br>
            <br></br>
            <h1 style={{ textAlign: "center" }}><b>{props.title}</b></h1>
            {props.message}
        </IonContent>
            <IonButton onClick={props.toggleModal} >Close</IonButton>
            <br></br>
            <br></br>
        </IonModal>
    </div>;
}


export default GenericModal;
