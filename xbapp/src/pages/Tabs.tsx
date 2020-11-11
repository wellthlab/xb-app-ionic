import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { cubeOutline, personCircle } from 'ionicons/icons';
import TabAccount from './TabAccount';
import TabExp from './TabExp';
import ExploreContainer from '../components/ExploreContainer';
import { IonReactRouter } from '@ionic/react-router';
import './Tabs.css';
import '@ionic/react/css/core.css';

const Tabs: React.FC = () => {
    return (
        <IonReactRouter>
                <IonTabs>
                    <IonRouterOutlet>
                        <Route path="/exp" component={TabExp} exact={true} />
                        <Route path="/account" component={TabAccount} exact={true} />
                        <Route path="/tabs" render={() => <Redirect to="/exp" />} exact={true} />
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
            </IonReactRouter>
    );
};

export default Tabs;
