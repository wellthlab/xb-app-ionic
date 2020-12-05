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
        return <IonPage>Group not found, is state loaded?</IonPage>
    }

    var exp = group.experiment.info;
    var entries = group.responses.own;

    entries = group.entries; // These are the responses, processed day by day

    // Summarise the reponses
    var rows = [];
    var total = 0;
    var questionnaired = false;

    for(var day of entries) {
        if(day.day == daynumber)
            break;
    }

    for(var entry of day.responses) {
        console.log(entry);
        if(entry.type =='minutes') {
            var time = entry.submitted.substring(10, 15);
            rows.push(<tr><td>{time}</td><td>{entry.minutes}</td></tr>)
            total = total * 1 + 1 * entry.minutes;
        } else if(entry.type == 'questionnaire') {
            questionnaired = true;
        }
    }

    var table = <table>
    <thead><tr><td>Submitted</td><td>Minutes</td></tr></thead>
    <tbody>{rows}</tbody>
    <tfoot><tr><td>Total</td><td>{total}</td></tr></tfoot>
    </table>

    var qbtn = '';
    if(!questionnaired) {
        qbtn = <IonButton routerLink={"/group/" + group._id + "/" + daynumber + "/add/questionnaire"}>Take Daily Questionnaire</IonButton>
    } else {
        qbtn = <p>You have done the daily questionnaire.</p>
    }

    return (
        <IonPage>
            <XBHeader title={group.name + ": Day " + daynumber}></XBHeader>
            <IonContent>

                <p>You've entered <strong>{total}</strong> minutes for day {daynumber}</p>

                <IonButton routerLink={"/group/" + group._id + "/" + daynumber + "/add/minutes"}>Add Minutes</IonButton>

                {qbtn}

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
