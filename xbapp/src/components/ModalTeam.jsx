import React, { Component, useState } from 'react';
import { IonButton, IonContent, IonAlert, IonPage, IonModal } from '@ionic/react';
import FunctionalityAlert from "../components/FunctionalityAlert";


function ModalTeam(props) {

    const [showAlert, setShowAlert] = useState(false);

    function toggleAlert() { setShowAlert(!showAlert)}

    if (!props.showModal) {
        return null;
    };
    return <div>
        <FunctionalityAlert showAlert={showAlert} toggleAlert={toggleAlert}/>
        <IonModal isOpen={props.showModal}>
            <h1 style={{ textAlign: "center" }}><b>Experiment in a Team</b></h1>
            <h2>Please choose one of the options below:</h2>
            <IonButton onClick={() => {
                toggleAlert()
            }}>Create a Team</IonButton>
            <IonButton routerLink="/experiment/group" onClick={() => {
                props.toggleModal()
            }}>Join a Team</IonButton>
            <IonButton onClick={() => {props.toggleModal()}} >Close</IonButton>
        </IonModal>

    </div>;
}


export default ModalTeam;
