import React, { Component, useState } from 'react';
import { IonContent, IonPage, IonModal, IonButton, IonBackButton } from '@ionic/react';
import XBHeader from '../components/XBHeader'

import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";

import { addControllersProp } from '../model/controllers'

import MinuteEntry from '../components/MinuteEntry';
import Questionnaire from '../components/Questionnaire';

const autoBindReact = require('auto-bind/react');


const AddResponse = ({ match, teams, account, controllers, history }) => {

    var gid = match.params.id; // Group ID comes from route
    var daynumber = match.params.day; // So does day number
    var type = match.params.type;

    //const history = useHistory();

    const [saved, setSaved] = useState(false);

    const [group, setGroup] = useState(false);

    if (group === false) {
        for (var g of teams.teams) { // Find the group in the store
            if (g._id == gid) {
                setGroup(g);
            }
        }

        return <IonPage>Group not found</IonPage>
    }

    async function save(res) {
        setSaved('saving');
        res.type = type;
        await controllers.ADD_RESPONSE(gid, res);
        setSaved('saved');
    }

    function reset() {
        history.goBack();
        setSaved('unsaved');
        // TODO: This is a bit of a hack; better way to completely reset this component ready for next use?
    }

    var content;
    if(saved == 'saved') {
        var link = '/group/' + gid + '/' + daynumber;
        content = <>
        <div className="done">
            <h1><ion-icon name="checkmark-circle-outline"></ion-icon> Great!</h1>
            <p className="centering">You've added a response. Keep adding responses to track your progress.</p>
            <p className="centering"><IonButton onClick={reset}>Back to Responses</IonButton></p>
        </div>
        </>
    } else if(saved == 'saving') {
        content = <></>
    } else {
        var input;
        // time key is used to re-create rather than re-use elements on subsequent uses
        var time = Date.now();
        switch(type) {
            case 'minutes':
                input = <MinuteEntry key={time} onSubmit={save} />
                break;

            case 'questionnaire':
                input = <Questionnaire key={time} onSubmit={save} />
                break;
            default:
                input = <p>Unknown Response Type</p>
                break;
        }

        var exp = group.experiment.info;
        var entries = group.user_responses;

        content = input
    }

    var typedesc;
    switch(type) {
        case 'minutes':
            typedesc = "Movement Minutes";
            break;
        case 'questionnaire':
            typedesc = "Daily Questionnaire";
            break;
    }

    return (
        <IonPage>
            <XBHeader title={"Add " + typedesc + ": Day " + daynumber}></XBHeader>
            <IonContent>

                {content}

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

)(addControllersProp(AddResponse));
