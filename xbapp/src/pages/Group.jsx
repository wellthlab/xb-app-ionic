import React, { Component, useState } from 'react';
import { IonContent, IonPage, IonModal, IonButton } from '@ionic/react';
import XBHeader from '../components/XBHeader'

import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import MinutesChart from "../components/minutesChart";
const autoBindReact = require('auto-bind/react');

var chosenDay = [];
/**
* TODO: This component is too big - Refactor some of the child components out
*/
const Group = ({ match, teams, props, account }) => {

    const history = useHistory();
    const [myModalCompleted, setMyModalCompleted] = useState({ isOpen: false });
    const [myModalMissingLastDay, setMyModalMissingLastDay] = useState({ isOpen: false });
    const [myModalMissingPreviousDay, setMyModalMissingPreviousDay] = useState({ isOpen: false });

    var gid = match.params.id; // Group ID comes from route
    var group = false;
    for (var g of teams.teams) { // Find the group in the store
        if (g._id == gid) {
            group = g;
        }
    }

    if (group === false) {
        return <IonPage>Nope :(</IonPage>
    }

    console.log("group", group);

    var exp = group.experiment.info;

    var entries = [{ day: 3, missing: false, vars: { minutes: 12 } }, { day: 2, missing: true, vars: {} }];

    return (
        <IonPage>
            <XBHeader title={group.name}></XBHeader>
            <IonContent>

                { /* Refactor these modals out into separate components */}
                <IonModal isOpen={myModalCompleted.isOpen}>
                    <h1 style={{ textAlign: "center" }}><b>Day {chosenDay.day} completed</b></h1>
                    <h2>Here is the data you submitted on this day:</h2>
                    <h2>Number of minutes: {chosenDay.minutes}</h2>
                    <IonButton onClick={() => setMyModalCompleted({ isOpen: false })} >Close</IonButton>
                </IonModal>

                <IonModal isOpen={myModalMissingLastDay.isOpen}>
                    <h1 style={{ textAlign: "center" }}><b>Today</b></h1>
                    <h2>Please submit the following data for today:</h2>
                    <IonButton onClick={() => {
                        setMyModalMissingLastDay({ isOpen: false });
                        history.push("/group/" + gid + "/" + chosenDay.day + "/timer"); window.location.reload()
                    }}>Add Minutes</IonButton>
                    <IonButton onClick={() => {
                        setMyModalMissingPreviousDay({ isOpen: false });
                        history.push("/group/" + gid + "/" + chosenDay.day + "/questionnaire"); window.location.reload();
                    }}>Daily Questionnaire</IonButton>
                    <IonButton onClick={() => setMyModalMissingLastDay({ isOpen: false })} >Close</IonButton>
                </IonModal>

                <IonModal isOpen={myModalMissingPreviousDay.isOpen}>
                    <h1 style={{ textAlign: "center" }}><b>Day {chosenDay.day}</b></h1>
                    <h2>There is no data recorded for this day. If you wish to complete this day, please fill in the following:</h2>
                    <IonButton onClick={() => {
                        setMyModalMissingPreviousDay({ isOpen: false });
                        history.push("/group/" + gid + "/" + chosenDay.day + "/timer"); window.location.reload();
                    }}>Add Minutes</IonButton>
                    <IonButton onClick={() => {
                        setMyModalMissingPreviousDay({ isOpen: false });
                        history.push("/group/" + gid + "/" + chosenDay.day + "/questionnaire"); window.location.reload();
                    }}>Daily Questionnaire</IonButton>
                    <IonButton onClick={() => setMyModalMissingPreviousDay({ isOpen: false })} >Close</IonButton>
                </IonModal>

                <MinutesChart />

                <ion-item><ion-heading><strong>{exp.name}</strong></ion-heading><ion-chip slot="end" color="primary">Day {exp.day}</ion-chip></ion-item>

                <ion-item>{exp.instructions}</ion-item>

                {entries.map((entry, i) => {
                    //if it's the last day- open the modal which gives timer or input and questionnaire
                    //if the entry is complete, open modal that shows data
                    //if it's a previous day, open just questionnaire/input
                    return <ion-card button onClick={() => {
                        if (entry.missing == false) {
                            setMyModalCompleted({ isOpen: true });
                        } else {
                            //opening the last missing day
                            if (entry.day == exp.day) {
                                setMyModalMissingLastDay({ isOpen: true });
                            } else {
                                //opening the last missing day
                                if (entry.day == exp.day) {
                                    setMyModalMissingLastDay({ isOpen: true });
                                } else {
                                    //opening a previous misisng day
                                    setMyModalMissingPreviousDay({ isOpen: true });
                                }
                            }
                        }

                        chosenDay = entry;
                    }} key={i}>
                        <ion-card-header>
                            <ion-card-title>Day {entry.day}</ion-card-title>
                            <ion-card-subtitle>{entry.missing ? "Missing Entry" : "Done"}</ion-card-subtitle>
                        </ion-card-header>

                        <ion-card-content>

                        </ion-card-content>
                    </ion-card>
                })}

            </IonContent>
        </IonPage>
    );
}

class EntryCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const entry = this.props.entry;

        return (
            <ion-card>
                <ion-card-header>
                    <ion-card-title>Day {entry.day}</ion-card-title>
                </ion-card-header>

                <ion-card-content>
                    <p>foo bar</p>
                </ion-card-content>
            </ion-card>
        );
    }
}

export default connect(
    (state, ownProps) => {
        return {
            account: state.account,
            teams: state.teams,
            boxes: state.boxes
        }
    },
    {

    }

)(Group);
