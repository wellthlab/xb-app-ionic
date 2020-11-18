import React, {Component} from 'react';
import { IonContent, IonPage, IonTitle, IonButton, IonItem } from '@ionic/react';
import XBHeader from '../components/XBHeader'
import './Account.css';

/**
 * Each slice exports some action creators that are used to push changes into the model
 */
import {LOG_IN, LOG_OUT} from '../model/slices/Account'

/**
 * We use this later, it joins the component up to the state, held in Redux
 */
import { connect } from 'react-redux'

const autoBindReact = require('auto-bind/react');

class TabAccount extends Component {
    constructor(props) {
        super(props);
        autoBindReact(this); // Binds 'this' to this object in all methods
    }

    render() {
        return (
        <IonPage>
          <XBHeader title="About XB"></XBHeader>
          <IonContent fullscreen>

                <p>eXperiment in a Box</p>

                <p>&copy; 2020 University of Southampton</p>

                <p><a href="#" target="_blank">Privacy Notice</a></p>

                <p><a href="#" target="_blank">Contact</a></p>

          </IonContent>
        </IonPage>
        );
    }
};

/**
 * Here, we wrap the raw component using the Redux connect() wrapper. It finds the
 * redux state (defined in index.jsx using the Provider component) and sets up props
 * for the component we defined above, using the maps below.
 */
export default connect(
    (state, ownProps) => {
        // A function to map parts of the global state (from the App's wrapper <Provider>)
        // into props for the wrapped component (which will be TabAccount)
        return {
            account: state.account // This turns state.account into an 'account' prop
        }
    },
    {
        // A map full of action creators; action creators are imported from slices
        LOG_OUT // shorthand for LOG_OUT: LOG_OUT
    }

)(TabAccount);
