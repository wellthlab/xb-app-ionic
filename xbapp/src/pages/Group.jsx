import React, { Component, useState } from 'react';
import { IonContent, IonPage, IonModal, IonButton } from '@ionic/react';
import XBHeader from '../components/XBHeader'

import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import MinutesChart from "../components/minutesChart";

import { Link } from "react-router-dom"

import ModalDayFull from "../components/ModalDayFull";
import ModalDayLast from "../components/ModalDayLast";
import ModalDayPrevious from "../components/ModalDayPrevious";

const autoBindReact = require('auto-bind/react');

var chosenDay = [];

const Group = ({ match, teams, props, account }) => {

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

    var entries = group.entries;

    var days = [];
    for(var i in entries) {
        var entry = entries[i];
        days.push(<ion-card key={i}><Link to={"/group/" + group._id + "/" + entry.day}>
            <ion-card-header>
                <ion-card-title>Day {entry.day}</ion-card-title>
                <ion-card-subtitle>{entry.missing ? "Missing Entry" : "Done"}</ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>

            </ion-card-content>
        </Link></ion-card>);
    }

    days.reverse();

    return (
        <IonPage>
            <XBHeader title={group.name}></XBHeader>
            <IonContent>

                <MinutesChart />

                <ion-item><ion-heading><strong>{exp.name}</strong></ion-heading><ion-chip slot="end" color="primary">Day {group.experiment.day}</ion-chip></ion-item>

                <ion-item>Team Code: {group.code}</ion-item>

                <ion-item>{exp.instructions}</ion-item>

                {days}

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
