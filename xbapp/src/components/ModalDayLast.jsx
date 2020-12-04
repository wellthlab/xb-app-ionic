import React, { Component, useState } from 'react';
import { IonButton, IonContent, IonAlert, IonPage, IonModal } from '@ionic/react';
import GenericAlert from "./GenericAlert";
import { useHistory } from "react-router-dom";

function ModalDayLast(props) {

    var _day = props.chosenDay;
    var _group_id = props.gid;

    const history = useHistory();
    
    if (!props.showModal) {
        return null;
    };
    return <div>
        <IonModal isOpen={props.showModalDayLast}>
            <h1 style={{ textAlign: "center" }}><b>Today</b></h1>
            <h2>Please submit the following data for today:</h2>
            <IonButton onClick={() => {
                props.toggleModalDayLast();
                history.push("/group/" + _group_id + "/" + _day.day + "/proof"); window.location.reload()
            }}>Add Minutes</IonButton>
            <IonButton onClick={() => {
                props.toggleModalDayLast();
                history.push("/group/" + _group_id + "/" + _day.day + "/questionnaire"); window.location.reload();
            }}>Daily Questionnaire</IonButton>
            <IonButton onClick={() => { props.toggleModalDayLast() }} >Close</IonButton>
        </IonModal>

    </div>;
}


export default ModalDayLast;
