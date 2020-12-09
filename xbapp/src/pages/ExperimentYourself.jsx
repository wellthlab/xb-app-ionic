import React, {Component} from 'react';
import { IonContent, IonPage } from '@ionic/react';
import XBHeader from '../components/XBHeader'
//import './ExpList.css';

import BoxesList from '../components/BoxesList'

import { connect } from 'react-redux'
const autoBindReact = require('auto-bind/react');

class ExperimentYourself extends Component {

    constructor(props) {
        super(props);
        autoBindReact(this); // Binds 'this' to this object in all methods
    }
    
    render() {
        console.log("Render all available boxes", this.props);
        
        return (
          <IonPage>
              <XBHeader title="Available Boxes"></XBHeader>
              <IonContent>
                    <BoxesList boxes={this.props.boxes.boxes} />
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
        pure: false,
    }

)(ExperimentYourself);
