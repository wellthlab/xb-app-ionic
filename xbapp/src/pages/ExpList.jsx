import React, {Component} from 'react';
import { IonContent, IonPage } from '@ionic/react';
import XBHeader from '../components/XBHeader'
import './ExpList.css';

import ExperimentList from '../components/ExperimentList'

import { addControllersProp } from '../model/controllers'

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
              <ion-fab vertical="bottom" horizontal="end" slot="fixed">
              <ion-button routerLink="/experiment">+
              </ion-button>
            </ion-fab>
          </IonPage>
        );
    }

    refresh() {
        this.props.controllers.LOAD_TEAMS();
    }
};

export default connect(
    (state, ownProps) => {
        return { teams: state.teams, experiments: state.experiments, boxes: state.boxes };
    },
    { // Actions to include as props
        pure: false,
    }

)(addControllersProp(ExpList));
