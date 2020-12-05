import React, { Component, useState } from 'react';
import { IonContent, IonPage, IonModal, IonButton } from '@ionic/react';
import XBHeader from '../components/XBHeader'

import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import MinutesChart from "../components/minutesChart";

import { Link } from "react-router-dom"

import { IonIcon } from '@ionic/react';
import { peopleOutline, alertOutline, todayOutline, add } from 'ionicons/icons';

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

    var day = group.experiment.day;
    var daydesc = day == 0 ? "Starts tomorrow" : (day < 0 ? "Starts in " + Math.abs(day) + " days" : "Day " + day)

    var members = group.users.length > 1 ? group.users.length + " members" : "Private Experiment";

    return (
        <IonPage>
            <XBHeader title={group.name}></XBHeader>
            <IonContent>

                <MinutesChart />

                <ion-item>
                    <ion-heading><strong>{exp.title}</strong></ion-heading>
                    <ion-chip slot="end" color="primary"><ion-label><IonIcon icon={todayOutline} /> {daydesc}</ion-label></ion-chip>
                </ion-item>

                <ion-item>
                    <ion-chip slot="start" color="success">
                        <ion-label><IonIcon icon={peopleOutline} /> {members}</ion-label>
                    </ion-chip>
                    <ion-chip slot="end" color="neutral">
                        <ion-label>Team Code: <strong>{group.code}</strong></ion-label>
                    </ion-chip>
                </ion-item>

                <ion-item>{exp.instructions}</ion-item>

                {days}

            </IonContent>
        </IonPage>
    );
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
