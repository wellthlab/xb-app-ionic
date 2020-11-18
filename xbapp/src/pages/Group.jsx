import React, {Component} from 'react';
import { IonContent, IonPage, IonTitle, IonButton, IonItem } from '@ionic/react';
import XBHeader from '../components/XBHeader'


import { connect } from 'react-redux'
const autoBindReact = require('auto-bind/react');

class Group extends Component {
    constructor(props) {
        super(props);
        autoBindReact(this); // Binds 'this' to this object in all methods
    }

    render() {

        var gid = this.props.match.params.id;

        for(var g of this.props.groups.groups) {
            if(g._group_id == gid) {
                var group = g;
            }
        }

        if(group === false) {
            return <IonPage>Nope :(</IonPage>
        }

        console.log("group", group);

        var exp = group.current_experiment;

        var entries = [{day: 3, missing: false, vars: {minutes: 12}}, {day: 2, missing: true, vars: {}}];

        return (
        <IonPage>
          <XBHeader title={group.name}></XBHeader>
          <IonContent>

                <p>Progress Chart</p>

                <ion-item><ion-heading><strong>{exp.name}</strong></ion-heading><ion-chip slot="end" color="primary">Day {exp.day}</ion-chip></ion-item>
                <ion-item>{exp.instructions}</ion-item>

                {entries.map((entry, i) => {

                    return <ion-card key={i}>
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
};

class EntryCard extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const entry = this.props.entry;

        return(
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
            groups: state.groups
        }
    },
    {

    }

)(Group);
