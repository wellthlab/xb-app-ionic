import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonToolbar,
  IonHeader,
  IonContent,
  IonList,
  IonItem,
  IonItemDivider
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

// Redux stuff
import { connect } from 'react-redux'

// Pages
import ExpList from './pages/ExpList';
import Account from './pages/Account';
import About from './pages/About';
import LoginAfter from './pages/LoginAfter';
import Register from './pages/Register.jsx';
import Tutorial from './pages/Tutorial.jsx';
import Group from './pages/Group.jsx';

// The login component
import Login from './components/Login.jsx';


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


class App extends Component {

  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  render() {

    let content = null;

    let { account } = this.props; // Unpack the props that connect() sorted out for us (thanks connect!)

    if (account.loggedin !== false) {
      content = <>
            <IonMenu side="start" contentId="appContent">
                <IonHeader>
                    <IonToolbar color="primary">Menu</IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        <IonItem routerLink="/group">Experiments</IonItem>
                        <IonItem routerLink="/account">Account</IonItem>
                        <IonItemDivider></IonItemDivider>
                        <IonItem routerLink="/about">About XB</IonItem>
                    </IonList>
                </IonContent>
            </IonMenu>

            <IonRouterOutlet id="appContent">
              <Route path="/group" component={ExpList} exact={true} />
              <Route path="/group/:id" component={Group} exact={true} />
              <Route path="/account" component={Account} exact={true} />
              <Route path="/about" component={About} exact={true} />
              <Route component={LoginAfter} />
            </IonRouterOutlet>
        </>
    } else {
      content =
        <IonRouterOutlet>
          <Route path="/register" component={Register} exact={true} />
          <Route path="/tutorial" component={Tutorial} exact={true} />
          <Route component={Login} />
        </IonRouterOutlet>
    }


    return <IonApp>
      <IonReactRouter>
        {content}
      </IonReactRouter>
    </IonApp>;

  }
};

export default connect(
  (state, ownProps) => {
    return { account: state.account };
  },
  { // Actions to include as props

  }

)(App);
