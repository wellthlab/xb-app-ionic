import React, {Component} from 'react';
import { IonContent, IonPage } from '@ionic/react';
import XBHeader from '../components/XBHeader'
import './ExpList.css';

import ExperimentList from '../components/ExperimentList'

import getXBClient from '../model/client';
import {CLEAR_TEAMS, SET_TEAMS} from '../model/slices/Teams'
import {CLEAR_EXPERIMENTS, SET_EXPERIMENTS} from '../model/slices/Experiments'

import { connect } from 'react-redux'
const autoBindReact = require('auto-bind/react');

class ExpList extends Component {

    constructor(props) {
        super(props);
        autoBindReact(this); // Binds 'this' to this object in all methods

        this.refresh();

    }

    render() {
        console.log("Render ExpList", this.props);

        var c;
        if(this.props.teams.fetching) {
            c = <ion-spinner name="crescent" />
        } else {
            c = <ExperimentList teams={this.props.teams.teams} />
        }

        return (
          <IonPage>
              <XBHeader title="Experiments"></XBHeader>
              <IonContent>
              {c}
              </IonContent>
          </IonPage>
        );
    }

    refresh() {
        this.props.CLEAR_TEAMS();
        this.props.CLEAR_EXPERIMENTS();

        var client = getXBClient();

        client.getExperiments().then(
            (exps) => {
                this.props.SET_EXPERIMENTS( { exps } )
            }, (err) => {
                console.error(err);
            }
        );

        client.getTeams().then(
            (teams) => {
                this.props.SET_TEAMS( { teams } )
            }, (err) => {
                console.error(err);
            }
        );
    }
};

export default connect(
    (state, ownProps) => {
        return { teams: state.teams, experiments: state.experiments, boxes: state.boxes };
    },
    { // Actions to include as props
        CLEAR_TEAMS,
        SET_TEAMS,
        CLEAR_EXPERIMENTS,
        SET_EXPERIMENTS
    }

)(ExpList);
