import React, { Component, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonToolbar,
  IonHeader,
  IonContent,
  IonList,
  IonItem,
  IonItemDivider,
  IonAlert
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

// Redux stuff
import { connect } from 'react-redux'

// Pages
import ExpList from './pages/ExpList';
import Account from './pages/Account';
import About from './pages/About';
import JourneyPlanner from './pages/JourneyPlanner';
import Register from './pages/Register.jsx';
import Tutorial from './pages/Tutorial.jsx';
import Group from './pages/Group.jsx';
import Day from './pages/Day'
import ExperimentYourself from './pages/ExperimentYourself.jsx';
import ExperimentInGroup from './pages/ExperimentInGroup.jsx';
import CreateTeam from './pages/CreateTeam';
import AddResponse from './pages/AddResponse';

// The login component
import Login from './components/Login.jsx';

//the alert component
import GenericAlert from "./components/GenericAlert";

/*************************************************************
 * CSS
 */
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
//import store from './model/store'

/****************************************************************/


// autoBind, because life's TOO SHORT
const autoBindReact = require('auto-bind/react'); // Needs to go after import, because it's a const


const App = ({ account }) => {

  const [showAlert, setShowAlert] = useState(false);
  function toggleAlert() { setShowAlert(!showAlert) }

  let content = null;



  if (account.loggedin !== false) {
    content = <>
      <IonMenu side="start" contentId="appContent">
        <IonHeader>
          <IonToolbar color="#5d8286">Menu</IonToolbar>
        </IonHeader>
        <IonContent>
          <GenericAlert showAlert={showAlert} toggleAlert={toggleAlert} message={'We are really sorry, this side of the application is not ready yet. We will let you know soon of future updates. :)'} />
          <IonList>
            <IonItem routerLink="/group">Experiments</IonItem>
            { /* <IonItem button onClick={() => {toggleAlert()}}>Calendar</IonItem>
               <IonItem button onClick={() => {toggleAlert()}}>Goal Diary</IonItem>
            <IonItemDivider></IonItemDivider> */ }
            <IonItem routerLink="/account">Profile</IonItem>
            <IonItem routerLink="/about">About XB</IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonRouterOutlet id="appContent">
      <Switch>
        <Route path="/group/:id/:day/add/:type" component={AddResponse} exact={true} />
        <Route path="/group/:id/:day" component={Day} exact={true} />
        <Route path="/group/:id" component={Group} exact={true} />
        <Route path="/group" component={ExpList} exact={true} />
        <Route path="/account" component={Account} exact={true} />
        <Route path="/about" component={About} exact={true} />
        <Route path="/experiment/yourself/:id" component={About} exact={true} />
        <Route path="/experiment/yourself" component={ExperimentYourself} exact={true} />
        <Route path="/experiment/group" component={ExperimentInGroup} exact={true} />
        <Route path="/experiment/create" component={CreateTeam} exact={true} />
        <Route path="/experiment" component={JourneyPlanner} exact={true} />
        <Route path="/tutorial" component={Tutorial} exact={true} />
        <Route path="/" render={() => <Redirect to="/experiment" />} exact={true} />
        <Route path="/register" render={() => <Redirect to="/experiment" />} exact={true} />
        </Switch></IonRouterOutlet>
    </>
  } else {
    content =
      <IonRouterOutlet><Switch>
        <Route path="/register" component={Register} exact={true} />
        <Route path="/tutorial" component={Tutorial} exact={true} />
        <Route path="/" component={Login} exact={true} />
        <Route path="/page" component={Tutorial} exact={true} />
        </Switch></IonRouterOutlet>
  }


  return <IonApp>
    <IonReactRouter>
      {content}
    </IonReactRouter>
  </IonApp>;

  //}
};

export default connect(
  (state, ownProps) => {
    return { account: state.account, };
  },
  { // Actions to include as props
    pure: false,
  }

)(App);
