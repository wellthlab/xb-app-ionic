import React, {Component} from 'react';
import { connect } from 'react-redux'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonItem } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import {LOG_IN, LOG_OUT} from '../model/reducers/accountReducer'
import './TabAccount.css';

const autoBindReact = require('auto-bind/react');

class TabAccount extends Component {
    constructor(props) {
        super(props)
        autoBindReact(this);
    }

    render() {
        return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Profile</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large"></IonTitle>
              </IonToolbar>
            </IonHeader>

            <IonItem>{this.props.account.name}</IonItem>

            <IonButton onclick={() => this.props.LOG_OUT({})}>Log Out</IonButton>

          </IonContent>
        </IonPage>
        );
    }
};

// Return the component, wrapped up so that it connects to the global state from Redux
export default connect(
    (state, ownProps) => {
        // A function to map parts of the global state (from the App's wrapper <Provider>)
        // into props for the wrapped component (which will be TabAccount)
        return {
            account: state.account
        }
    },
    {
        // A map full of action creators
        LOG_OUT
    }

)(TabAccount);
