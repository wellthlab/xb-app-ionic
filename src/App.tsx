import React from 'react';
import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

const App = () => {
    return (
        <IonApp>
            <IonReactRouter>
                <IonRouterOutlet>
                    <Route path="/login" render={() => 'Login'} />
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
