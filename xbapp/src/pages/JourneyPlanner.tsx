import { IonButton, IonContent, IonAlert, IonPage, IonModal } from '@ionic/react';
import React, { useState } from 'react';
import XBHeader from '../components/XBHeader'
import './JourneyPlanner.scss';
import MinutesChart from "../components/minutesChart";
import GenericAlert from "../components/GenericAlert";
import ModalTeam from "../components/ModalTeam";
import Timer from '../components/Timer'
const JourneyPlanner: React.FC = () => {

    const [showModal, setModalTeam] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    function toggleAlert() { setShowAlert(!showAlert)}
    function toggleModal() { setModalTeam(!showModal)}

    return (
        <IonPage className="planner">
            <XBHeader title="Add an Experiment"></XBHeader>
            <IonContent>

                <ModalTeam showModal={showModal} toggleModal={toggleModal}/>
                <img src="assets/health.png" alt="XB Health" />

                <h1>Hello!</h1>
                <p>To get started you need to create a new Movement Minutes experiment, or join somebody else's!</p>

                <div className="centering">
                    <IonButton routerLink="/experiment/create" >Create a new Experiment</IonButton>
                    <p>(you can experiment by yourself, or invite other people to join in)</p>
                </div>
                <div className="centering">
                    <IonButton routerLink="/experiment/group" >Join Someone Else's Experiment</IonButton>
                </div>
                {/*<div className="centering">
                    <IonButton onClick={() => {toggleModal()}}>Experiment in a Team</IonButton>
                </div>*/}

            </IonContent>
        </IonPage>
    );
};

export default JourneyPlanner;
