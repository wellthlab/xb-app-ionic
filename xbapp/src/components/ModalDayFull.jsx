import React, { Component, useState } from 'react';
import { IonButton, IonContent, IonAlert, IonPage, IonModal } from '@ionic/react';
import FunctionalityAlert from "./FunctionalityAlert";


function ModalDayFull(props) {

    var _day = props.chosenDay;
    var _group_id = props.gid;

    if (!props.showModal) {
        return null;
    };
    return <div>
        <IonModal isOpen={props.showModalDayFull}>
            <h1 style={{ textAlign: "center" }}><b>Day {_day.day} completed</b></h1>
            <h2>Here is the data you submitted on this day:</h2>
            <h2>Number of minutes: {_day.minutes}</h2>
            <IonButton onClick={() => { props.toggleModalDayFull() }} >Close</IonButton>
        </IonModal>

    </div>;
}


export default ModalDayFull;
