import React, { Component, useState } from 'react';
import { IonButton, IonContent, IonAlert, IonPage, IonModal } from '@ionic/react';
import GenericAlert from "./GenericAlert";
import { useHistory } from "react-router-dom";

function ModalDayPrevious(props) {

    var _day = props.chosenDay;
    var _group_id = props.gid;

    const history = useHistory();
    
    if (!props.showModal) {
        return null;
    };
    return <div>
        <IonModal isOpen={props.showModalDayPrevious}>
            <h1 style={{ textAlign: "center" }}><b>Day {_day.day}</b></h1>
                    <h2>There is no data recorded for this day. If you wish to complete this day, please fill in the following:</h2>
                    <IonButton onClick={() => {
                        props.toggleModalDayPrevious();
                        history.push("/group/" + _group_id + "/" + _day.day + "/proof"); window.location.reload();
                    }}>Add Minutes</IonButton>
                    <IonButton onClick={() => {
                        props.toggleModalDayPrevious();
                        history.push("/group/" + _group_id + "/" + _day.day + "/questionnaire"); window.location.reload();
                    }}>Daily Questionnaire</IonButton>
            <IonButton onClick={() => { props.toggleModalDayPrevious() }} >Close</IonButton>
        </IonModal>

    </div>;
}


export default ModalDayPrevious;
