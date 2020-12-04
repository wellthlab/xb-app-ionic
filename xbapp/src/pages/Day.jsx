import React, { Component, useState } from 'react';
import { IonContent, IonPage, IonModal, IonButton } from '@ionic/react';
import XBHeader from '../components/XBHeader'

import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";

const autoBindReact = require('auto-bind/react');


const Day = ({ match, teams, props, account }) => {

    var gid = match.params.id; // Group ID comes from route
    var daynumber = match.params.day; // So does day number

        const history = useHistory();

    var group = false;
    for (var g of teams.teams) { // Find the group in the store
        if (g._id == gid) {
            group = g;
        }
    }

    if (group === false) {
        return <IonPage>Nope :(</IonPage>
    }

    var exp = group.experiment.info;
    var entries = group.user_responses;

    return (
        <IonPage>
            <XBHeader title={group.name + ": Day " + daynumber}></XBHeader>
            <IonContent>

                <ion-item><ion-heading><strong>{exp.name}</strong></ion-heading><ion-chip slot="end" color="primary">Day {exp.day}</ion-chip></ion-item>
                <ion-item>{exp.instructions}</ion-item>

                {/* TODO: Add list of entries here */}

                <IonButton routerLink={"/group/" + group._id + "/" + daynumber + "/minutes"}>Add Minutes</IonButton>
                <IonButton routerLink={"/group/" + group._id + "/" + daynumber + "/questionnaire"}>Daily Questionnaire</IonButton>

            </IonContent>
        </IonPage>
    );
}


export default connect(
    (state, ownProps) => {
        return {
            account: state.account,
            teams: state.teams
        }
    },
    {

    }

)(Day);
