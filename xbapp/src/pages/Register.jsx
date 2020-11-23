import React, {Component} from 'react';
import { connect } from 'react-redux'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Register.css';
//have tried this next function in order to change the values of the content of the iframe - however we have a security issue
//SecurityError: Blocked a frame with origin "http://localhost:8100" from accessing a cross-origin frame.
//apparently this can be fixed if we are the owners of both frames (which we are..) https://stackoverflow.com/questions/25098021/securityerror-blocked-a-frame-with-origin-from-accessing-a-cross-origin-frame
import './function.js';


const TabAccount = (account) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large"></IonTitle>
          </IonToolbar>
        </IonHeader>

        <iframe id="myFrame" class= 'webPage' name= "registerPage" src="https://xbvisualise.herokuapp.com/register/" allowfullscreen></iframe>
        
        <script src="./function.js"></script>
      </IonContent>
    </IonPage>
  );
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
    }

)(TabAccount);
