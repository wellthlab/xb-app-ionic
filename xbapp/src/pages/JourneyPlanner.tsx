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
        <IonPage>
            <XBHeader title="Add an Experiment"></XBHeader>
            <IonContent>
                <GenericAlert showAlert={showAlert} toggleAlert={toggleAlert} message={'We are really sorry, this side of the application is not ready yet. We will let you know soon of future updates. :)'}/>
                <ModalTeam showModal={showModal} toggleModal={toggleModal}/>
                <img src="assets/health.png" alt="XB Health" />

                <p style={{ textAlign: "center", margin: "20px 0 20px 0" }}>Let's build some new skills! Please choose your new journey below!</p>
                <div className="centering">
                    <IonButton routerLink="/experiment/create" >Experiment By Yourself</IonButton>
                </div>
                <div className="centering">
                    <IonButton onClick={() => {toggleModal()}}>Experiment in a Team</IonButton>
                </div>




            </IonContent>
        </IonPage>
    );
};

export default JourneyPlanner;
