import React from 'react';
import { Provider } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy';
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { IconContext, Users, Gear, Moon, ForkKnife, PersonSimpleRun } from 'phosphor-react';

import store, { useSelector, useDispatch } from './store';
import { selectIsAuthenticated, setIsEnrolled, hydrateAccount } from './state/account';
import Loading from './common/Loading';
import { LoginForm, RegisterForm } from './auth';
import { StudyInformation, EnrollConsentForm, CompleteProfileForm } from './enroll';
import { TeamInsights, TeamGuard } from './team';

interface IInnerAppProps {
    children: React.ReactNode;
}

const AppWrapper = function ({ children }: IInnerAppProps) {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isEnrolled = useSelector(setIsEnrolled);

    const [hydrating, setHydrating] = React.useState(true);

    const dispatch = useDispatch();
    React.useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        const hydrate = async function () {
            console.log('HYDRATING APP...');
            setHydrating(true);

            await dispatch(hydrateAccount());

            console.log('APP HYDRATED');
            setHydrating(false);
        };

        hydrate();
    }, [isAuthenticated]);

    let content;

    if (!isAuthenticated) {
        content = <Redirect to="/auth" />;
    } else if (hydrating) {
        content = <Loading />;
    } else if (!isEnrolled) {
        content = <Redirect to="/enroll" />;
    } else {
        content = <Redirect to="/main/team" />;
    }

    return (
        <React.Fragment>
            {content}
            {children}
        </React.Fragment>
    );
};

const App = function () {
    return (
        <IonApp>
            <Provider store={store}>
                <CssVarsProvider defaultMode="system">
                    <IconContext.Provider value={{ weight: 'light', size: 28 }}>
                        <IonReactRouter>
                            <AppWrapper>
                                <IonRouterOutlet>
                                    <Route path="/auth" component={LoginForm} exact />
                                    <Route path="/auth/register" component={RegisterForm} exact />

                                    <Route path="/enroll" component={StudyInformation} exact />
                                    <Route path="/enroll/consent" component={EnrollConsentForm} exact />
                                    <Route path="/enroll/profile" component={CompleteProfileForm} exact />

                                    <Route
                                        path="/main"
                                        component={() => (
                                            <IonTabs>
                                                <IonRouterOutlet>
                                                    <Route
                                                        path="/main/team"
                                                        component={() => (
                                                            <TeamGuard>
                                                                <TeamInsights />
                                                            </TeamGuard>
                                                        )}
                                                        exact
                                                    />

                                                    <Route
                                                        path="/main/eat"
                                                        component={() => (
                                                            <TeamGuard>
                                                                <TeamInsights />
                                                            </TeamGuard>
                                                        )}
                                                        exact
                                                    />
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
                                                    <IonTabButton tab="sleep" href="/main/sleep">
                                                        <Moon />
                                                    </IonTabButton>
                                                    <IonTabButton tab="settings" href="/main/settings">
                                                        <Gear />
                                                    </IonTabButton>
                                                </IonTabBar>
                                            </IonTabs>
                                        )}
                                    />
                                </IonRouterOutlet>
                            </AppWrapper>
                        </IonReactRouter>
                    </IconContext.Provider>
                </CssVarsProvider>
            </Provider>
        </IonApp>
    );
};

export default App;
