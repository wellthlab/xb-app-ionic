import React, {Component} from 'react';
import { IonContent, IonPage } from '@ionic/react';
import XBHeader from '../components/XBHeader'
import './ExpList.css';

import ExperimentList from '../components/ExperimentList'

import { connect } from 'react-redux'
const autoBindReact = require('auto-bind/react');

class ExpList extends Component {

    constructor(props) {
        super(props);
        autoBindReact(this); // Binds 'this' to this object in all methods
    }

    render() {
        console.log("Render ExpList", this.props);

        return (
          <IonPage>
              <XBHeader title="Experiments"></XBHeader>
              <IonContent>
                    <ExperimentList groups={this.props.groups.groups} />
              </IonContent>
          </IonPage>
        );
    }
};

export default connect(
    (state, ownProps) => {
        return { groups: state.groups, experiments: state.experiments, boxes: state.boxes };
    },
    { // Actions to include as props

    }

)(ExpList);
