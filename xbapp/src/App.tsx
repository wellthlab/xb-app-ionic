import React from 'react';
import { Provider } from 'react-redux'
import { Redirect, Route } from 'react-router-dom';
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cubeOutline, personCircle } from 'ionicons/icons';
import Tabs from './pages/Tabs';
import TabExp from './pages/TabExp';
import TabAccount from './pages/TabAccount';
import SignIn from './pages/SignIn';


import Login from './components/Login.jsx';

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
        content = <IonTabs>
            <IonRouterOutlet>
                <Route path="/signin" component={SignIn} exact={true} />
                <Route path="/tabs" component={Tabs} exact={true} />
                <Route path="/exp" component={TabExp} exact={true} />
                <Route path="/account" component={TabAccount} exact={true} />
                <Route path="/" render={() => <Redirect to="/signin" />} exact={true} />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="exp" href="/exp">
                    <IonIcon icon={cubeOutline} />
                    <IonLabel>Experiments</IonLabel>
                </IonTabButton>
                <IonTabButton tab="account" href="/account">
                    <IonIcon icon={personCircle} />
                    <IonLabel>Account</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    } else {
        content = <Login />
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
