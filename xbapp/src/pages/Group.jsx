import React, { Component, useState } from 'react';
import { IonContent, IonPage, IonModal, IonButton } from '@ionic/react';
import XBHeader from '../components/XBHeader'

import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import MinutesChart from "../components/minutesChart";

import ModalDayFull from "../components/ModalDayFull";
import ModalDayLast from "../components/ModalDayLast";
import ModalDayPrevious from "../components/ModalDayPrevious";

const autoBindReact = require('auto-bind/react');

var chosenDay = [];
/**
* TODO: This component is too big - Refactor some of the child components out
*/
const Group = ({ match, teams, props, account }) => {

    const history = useHistory();

    const [showModalDayFull, setModalTeamDayFull] = useState(false);
    function toggleModalDayFull() { setModalTeamDayFull(!showModalDayFull) }

    const [showModalDayLast, setModalTeamDayLast] = useState(false);
    function toggleModalDayLast() { setModalTeamDayLast(!showModalDayLast) }

    const [showModalDayPrevious, setModalTeamDayPrevious] = useState(false);
    function toggleModalDayPrevious() { setModalTeamDayPrevious(!showModalDayPrevious) }


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

                <ModalDayFull showModalDayFull={showModalDayFull} toggleModalDayFull={toggleModalDayFull} chosenDay={chosenDay} gid={gid}/>
                <ModalDayLast showModalDayLast={showModalDayLast} toggleModalDayLast={toggleModalDayLast} chosenDay={chosenDay} gid={gid}/>
                <ModalDayPrevious showModalDayPrevious={showModalDayPrevious} toggleModalDayPrevious={toggleModalDayPrevious} chosenDay={chosenDay} gid={gid}/>

                <MinutesChart />

                <ion-item><ion-heading><strong>{exp.name}</strong></ion-heading><ion-chip slot="end" color="primary">Day {exp.day}</ion-chip></ion-item>

                <ion-item>Team Code: {group.code}</ion-item>

                <ion-item>{exp.instructions}</ion-item>

                {entries.map((entry, i) => {
                    //if it's the last day- open the modal which gives timer or input and questionnaire
                    //if the entry is complete, open modal that shows data
                    //if it's a previous day, open just questionnaire/input
                    return <ion-card button onClick={() => {
                        if (entry.missing == false) {
                            toggleModalDayFull();
                        } else {
                            //opening the last missing day
                            if (entry.day == exp.day) {
                                toggleModalDayLast();
                            } else {
                                //opening a previous misisng day
                                toggleModalDayPrevious();

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
