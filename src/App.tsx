import React from 'react';
import { Provider } from 'react-redux';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/joy';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonLabel } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { IconContext, Gear, Cube, ListChecks } from 'phosphor-react';

import { ThemeProvider, ColorModeController } from './theme';
import store, { useSelector, useDispatch } from './slices/store';
import { boot } from './slices/globalActions';
import { selectIsAuthenticated, selectIsEnrolled } from './slices/account';
import Page from './components/foundation/Page';
import Centre from './components/foundation/Centre';

import LoginScreen from './screens/auth/Login';
import RegisterScreen from './screens/auth/Register';
import ResetPasswordScreen from './screens/auth/ResetPassword';
import NewPasswordScreen from './screens/auth/NewPassword';
import ConfirmAccountScreen from './screens/auth/ConfirmAccount';

import OnboardingStudyInformationScreen from './screens/onboarding/StudyInformation';
import OnboardingConsentScreen from './screens/onboarding/Consent';

import AllSettingsTab from './screens/settings/AllSettings';
import SettingsInformationScreen from './screens/settings/StudyInformation';

import BoxesListTab from './screens/experiments/BoxesList';
import ExperimentsListScreen from './screens/experiments/ExperimentsList';
import ChildExperimentsListScreen from './screens/experiments/ChildExperimentsList';
import ExperimentTimelineScreen from './screens/experiments/ExperimentTimeline';

import JournalTab from './screens/journal/Journal';

import TodayTab from './screens/Today/Today';

const AppFlowController = function () {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isEnrolled = useSelector(selectIsEnrolled);
    const location = useLocation();

    const [hydrating, setHydrating] = React.useState(true);
    const dispatch = useDispatch();
    React.useEffect(() => {
        // Call boot only if authenticated

        if (!isAuthenticated) {
            return;
        }

        const hydrate = async function () {
            console.log('BOOTING...');
            setHydrating(true);

            await dispatch(boot());

            console.log('BOOTED');
            setHydrating(false);
        };

        hydrate();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        if (location.pathname === '/auth/new-password' || location.pathname === '/auth/confirm') {
            return null;
        }

        return <Redirect to="/auth" />;
    }

    if (hydrating) {
        return <Redirect to="/loading" />;
    }

    if (!isEnrolled) {
        return <Redirect to="/onboarding" />;
    }

    return <Redirect to="/main" />;
};

const App = function () {
    return (
        <IonApp>
            <Provider store={store}>
                <IonReactRouter>
                    <ThemeProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <IconContext.Provider value={{ weight: 'light', size: 24 }}>
                                <ColorModeController />
                                <AppFlowController />
                                <IonRouterOutlet>
                                    <Route path="/auth" exact>
                                        <LoginScreen />
                                    </Route>

                                    <Route path="/auth/register" exact>
                                        <RegisterScreen />
                                    </Route>

                                    <Route path="/auth/reset-password" exact>
                                        <ResetPasswordScreen />
                                    </Route>

                                    <Route path="/auth/new-password" exact>
                                        <NewPasswordScreen />
                                    </Route>

                                    <Route path="/auth/confirm" exact>
                                        <ConfirmAccountScreen />
                                    </Route>

                                    <Route path="/onboarding" exact>
                                        <OnboardingStudyInformationScreen />
                                    </Route>

                                    <Route path="/onboarding/consent" exact>
                                        <OnboardingConsentScreen />
                                    </Route>

                                    <Route path="/loading">
                                        <Page>
                                            <Centre>
                                                <CircularProgress />
                                            </Centre>
                                        </Page>
                                    </Route>

                                    <Route path="/main">
                                        <IonTabs>
                                            <IonRouterOutlet>
                                                <Route path="/main" exact>
                                                    <Redirect to="/main/today" />
                                                </Route>

                                                <Route path="/main/box" exact>
                                                    <BoxesListTab />
                                                </Route>

                                                <Route path="/main/box/:type" exact>
                                                    <ExperimentsListScreen />
                                                </Route>

                                                <Route path="/main/box/:type/:experimentId" exact>
                                                    <ChildExperimentsListScreen />
                                                </Route>

                                                <Route path="/main/box/:type/:parentId/:experimentId" exact>
                                                    <ExperimentTimelineScreen />
                                                </Route>

                                                <Route path="/main/today" exact>
                                                    <TodayTab />
                                                </Route>

                                                <Route path="/main/settings" exact>
                                                    <AllSettingsTab />
                                                </Route>

                                                <Route path="/main/settings/about" exact>
                                                    <SettingsInformationScreen />
                                                </Route>
                                            </IonRouterOutlet>

                                            <IonTabBar slot="bottom">
                                                <IonTabButton tab="home" href="/main/today">
                                                    <ListChecks />
                                                    <IonLabel>Today</IonLabel>
                                                </IonTabButton>
                                                <IonTabButton tab="box" href="/main/box">
                                                    <Cube />
                                                    <IonLabel>Boxes</IonLabel>
                                                </IonTabButton>
                                                <IonTabButton tab="settings" href="/main/settings">
                                                    <Gear />
                                                    <IonLabel>Settings</IonLabel>
                                                </IonTabButton>
                                            </IonTabBar>
                                        </IonTabs>
                                    </Route>
                                </IonRouterOutlet>
                            </IconContext.Provider>
                        </LocalizationProvider>
                    </ThemeProvider>
                </IonReactRouter>
            </Provider>
        </IonApp>
    );
};

export default App;
