import React, {Component} from 'react';
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

// Icons
import { cubeOutline, personCircle } from 'ionicons/icons';

// Redux stuff
import { connect } from 'react-redux'


// Pages
import TabExp from './pages/TabExp';
import TabAccount from './pages/TabAccount';

// The login component
import Login from './components/Login';

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

        let {account} = this.props; // Unpack the props that connect() sorted out for us (thanks connect!)

        if(account.loggedin) {
            content = <IonTabs>
                <IonRouterOutlet>
                    <Route path="/exp" component={TabExp} exact={true} />
                    <Route path="/account" component={TabAccount} exact={true} />
                    <Route path="/" render={() => <Redirect to="/exp" />} exact={true} />
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
            // TODO: Use another IonRouter to route between login and register?
            content = <Login />
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
        return {account: state.account};
    },
    { // Actions to include as props

    }

)(App);
