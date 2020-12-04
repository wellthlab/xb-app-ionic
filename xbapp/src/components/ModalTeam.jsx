import React, { Component, useState } from 'react';
import { IonButton, IonContent, IonAlert, IonPage, IonModal } from '@ionic/react';


function ModalTeam(props) {

    const [showAlert, setShowAlert] = useState(false);

    function toggleAlert() { setShowAlert(!showAlert)}

    if (!props.showModal) {
        return null;
    };
    return <div>
        <IonModal isOpen={props.showModal}>
            <h1 style={{ textAlign: "center" }}><b>Experiment in a Team</b></h1>
            <h2>You can create a new team, or join one that you've been invited to.</h2>
            <IonButton routerLink="/experiment/create" onClick={props.toggleModal}>Create a new Team</IonButton>
            <IonButton routerLink="/experiment/group" onClick={props.toggleModal}>Join a Team</IonButton>
            <IonButton onClick={props.toggleModal} >Close</IonButton>
        </IonModal>

    </div>;
}


export default ModalTeam;
