import React from 'react';
import { Provider } from 'react-redux'
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cubeOutline, personCircle } from 'ionicons/icons';
import Tabs from './pages/Tabs';
import TabExp from './pages/TabExp';
import TabAccount from './pages/TabAccount';
import LoginAfter from './pages/LoginAfter';


import Login from './components/Login.jsx';
import Register from './pages/Register.jsx';

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
import store from './model/store'

const App = function () {

  let content = null;

  let state = store.getState();

  if (state.account.loggedin) {
    content =
      <IonRouterOutlet>
        <Route path="/after" component={LoginAfter} exact={true} />
        <Route path="/tabs" component={Tabs} exact={true} />
        <Route path="/exp" component={TabExp} exact={true} />
        <Route path="/account" component={TabAccount} exact={true} />
        <Route path="/" render={() => <Redirect to="/after" />} exact={true} />
      </IonRouterOutlet>
  } else {
    content =
      <IonRouterOutlet>
        <Route path="/login" component={Login} exact={true} />
        <Route path="/register" component={Register} exact={true} />
        <Route path="/" render={() => <Redirect to="/login" />} exact={true} />
      </IonRouterOutlet>
  }

  return <IonApp>
    <Provider store={store}>
      <IonReactRouter>
        {content}
      </IonReactRouter>
    </Provider>
  </IonApp>
};

export default App;
