import React, { Component, useState } from 'react';
import { IonContent, IonPage, IonModal, IonButton, IonCard } from '@ionic/react';
import XBHeader from '../components/XBHeader'

import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import MinutesChart from "../components/minutesChart";

import { Link } from "react-router-dom"

import { IonIcon } from '@ionic/react';
import { peopleOutline, alertOutline, todayOutline, add } from 'ionicons/icons';
import Instructions from "../components/Instructions"
import GenericAlert from "../components/GenericAlert";

const autoBindReact = require('auto-bind/react');

var chosenDay = [];

const Group = ({ match, teams, props, account }) => {


    const [showAlert, setShowAlert] = useState(false);
    function toggleAlert() { setShowAlert(!showAlert)}


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
    for(var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        days.push(<IonCard key={i} routerLink={"/group/" + group._id + "/" + entry.day}>
            <ion-card-header>
                <ion-card-title>Day {entry.day}</ion-card-title>
            </ion-card-header>

            <ion-card-content>
                <ion-item>
                    <ion-chip slot="start" color={ entry.questionnaire ? 'success' : 'danger' }>{entry.questionnaire ? "Questionnaire Done" : "Questionnaire Missing"}</ion-chip>
                    <ion-chip slot="end" color={ entry.minutes > 0 ? 'success' : 'danger' }>{entry.minutes} minutes</ion-chip>

                </ion-item>
            </ion-card-content>
        </IonCard>);
    }

    days.reverse();

    var day = group.experiment.day;
    var daydesc = day == 0 ? "Starts tomorrow" : (day < 0 ? "Starts in " + Math.abs(day) + " days" : "Day " + day)

    var members = group.users.length > 1 ? group.users.length + " members" : "Private Experiment";

    return (
        <IonPage>
            <XBHeader title={group.name}></XBHeader>
            <IonContent>
                <GenericAlert showAlert={showAlert} toggleAlert={toggleAlert} message={'The chart displays 2 sets of data: the number of minutes you ran everyday, and your mood compared to the day before. The number of minutes starts from 0, whereas the mood begins from -2 (feeling a lot worse than the previous day) up to 2 (feeling a lot better than the previous day). You can notice the development of the bars to observe whether you feel better when running each day. If you tap on a bar, you will be able to see more information on that particular day.'}/>
        
                <MinutesChart group={group}/>
                <a href="javascript:void(0)" style={{ textAlign: "center", margin: "20px 0 20px 0" }} onClick={() => {toggleAlert()}}>How do I interpret the bar chart?</a>
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

                <ion-item><Instructions html={group.experiment.current_stage.instructions} /></ion-item>

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
