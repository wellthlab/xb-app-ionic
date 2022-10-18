import React from 'react';
import { Provider } from 'react-redux';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy';
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { IconContext, Users, Gear, ForkKnife, PersonSimpleRun } from 'phosphor-react';

import store, { useSelector, useDispatch } from './store';
import { selectIsAuthenticated, setIsEnrolled, hydrateAccount } from './slices/account';
import { LoadingPage } from './misc';
import { LoginForm, RegisterForm } from './auth';
import { StudyInformation, EnrollConsentForm, CompleteProfileForm } from './enroll';
import { TeamInsights, TeamGuard } from './team';
import { SettingsList } from './settings';

const Redirects = function () {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isEnrolled = useSelector(setIsEnrolled);

    const [hydrating, setHydrating] = React.useState(true);

    const dispatch = useDispatch();
    React.useEffect(() => {
        // Hyrdate account only if authenticated

        if (!isAuthenticated) {
            return;
        }

        const hydrate = async function () {
            console.log('HYDRATING ACCOUNT...');
            setHydrating(true);

            await dispatch(hydrateAccount());

            console.log('ACCOUNT HYDRATED');
            setHydrating(false);
        };

        hydrate();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <Redirect to="/auth" />;
    }

    if (hydrating) {
        return <Redirect to="/loading" />;
    }

    if (!isEnrolled) {
        return <Redirect to="/enroll" />;
    }

    return <Redirect to="/main" />;
};

const App = function () {
    return (
        <IonApp>
            <Provider store={store}>
                <CssVarsProvider defaultMode="system">
                    <IconContext.Provider value={{ weight: 'light', size: 24 }}>
                        <IonReactRouter>
                            <Redirects />
                            <IonRouterOutlet>
                                <Route path="/auth" exact>
                                    <LoginForm />
                                </Route>

                                <Route path="/auth/register" exact>
                                    <RegisterForm />
                                </Route>

                                <Route path="/enroll" exact>
                                    <StudyInformation />
                                </Route>

                                <Route path="/enroll/consent" exact>
                                    <EnrollConsentForm />
                                </Route>

                                <Route path="/enroll/profile" exact>
                                    <CompleteProfileForm />
                                </Route>

                                <Route path="/loading">
                                    <LoadingPage />
                                </Route>

                                <Route path="/main">
                                    <IonTabs>
                                        <IonRouterOutlet>
                                            <Route path="/main" exact>
                                                <Redirect to="/main/team" />
                                            </Route>

                                            <Route path="/main/team" exact>
                                                <TeamGuard>
                                                    <TeamInsights />
                                                </TeamGuard>
                                            </Route>

                                            <Route path="/main/eat" exact>
                                                <TeamGuard>
                                                    <TeamInsights />
                                                </TeamGuard>
                                            </Route>

                                            <Route path="/main/move" exact>
                                                <TeamGuard>
                                                    <TeamInsights />
                                                </TeamGuard>
                                            </Route>

                                            <Route path="/main/settings" exact>
                                                <SettingsList />
                                            </Route>
                                        </IonRouterOutlet>

                                        <IonTabBar slot="bottom">
                                            <IonTabButton tab="team" href="/main/team">
                                                <Users />
                                            </IonTabButton>
                                            <IonTabButton tab="eat" href="/main/eat">
                                                <ForkKnife />
                                            </IonTabButton>
                                            <IonTabButton tab="move" href="/main/move">
                                                <PersonSimpleRun />
                                            </IonTabButton>
                                            <IonTabButton tab="settings" href="/main/settings">
                                                <Gear />
                                            </IonTabButton>
                                        </IonTabBar>
                                    </IonTabs>
                                </Route>
                            </IonRouterOutlet>
                        </IonReactRouter>
                    </IconContext.Provider>
                </CssVarsProvider>
            </Provider>
        </IonApp>
    );
};

export default App;
