import React from 'react';
import { Provider } from 'react-redux';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/joy';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonLabel } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { IconContext, Info, Gear, Cube, ListChecks, CalendarBlank } from 'phosphor-react';

import { ThemeProvider, ColorModeController } from './theme';
import store, { useSelector, useDispatch } from './slices/store';
import { boot } from './slices/globalActions';
import { selectIsAuthenticated, selectIsEnrolled, selectIsOnboarded } from './slices/account';
import Page from './components/foundation/Page';
import Centre from './components/foundation/Centre';

import Strings from './utils/string_dict.js';

import LoginScreen from './screens/auth/Login';
import RegisterScreen from './screens/auth/Register';
import ResetPasswordScreen from './screens/auth/ResetPassword';
import NewPasswordScreen from './screens/auth/NewPassword';
import ConfirmAccountScreen from './screens/auth/ConfirmAccount';

import OnboardingStudyInformationScreen from './screens/onboarding/StudyInformation';
import NewProfileScreen from './screens/onboarding/NewProfile';
import WelcomeScreen from './screens/onboarding/Welcome';

import AllSettingsTab from './screens/settings/AllSettings';
import EditProfileScreen from './screens/settings/EditProfile';
import SettingsInformationScreen from './screens/settings/StudyInformation';

import BoxesListTab from './screens/experiments/BoxesList';
import ExperimentsListScreen from './screens/experiments/ExperimentsList';

import JournalTab from './screens/journal/Journal';
import TodayTab from './screens/today/Today';
import AboutThisStudy from './components/AboutThisStudy';
import { ParQScreen } from './screens/onboarding/ParQ';

import './global.scss';

const SUPPORT_LANG = ['en', 'es'];

const AppFlowController = function ({ parQ }: { parQ: any }) {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isEnrolled = useSelector(selectIsEnrolled);
    const isOnboarded = useSelector(selectIsOnboarded);
    const location = useLocation();

    const [hydrating, setHydrating] = React.useState(true);
    const dispatch = useDispatch();

    React.useEffect(() => {
        function switchLanguage(ev: KeyboardEvent) {
            if (ev.ctrlKey && ev.shiftKey && ev.key === 'L') {
                ev.preventDefault();
                console.log('Language switch key combo detected');
                const langIndex = localStorage.getItem('lang') ?? '0';
                localStorage.setItem('lang', String((Number(langIndex) + 1) % SUPPORT_LANG.length));
                window.location.href = '/';
            }
        }

        document.addEventListener('keydown', switchLanguage);
        return () => {
            document.removeEventListener('keydown', switchLanguage);
        };
    }, []);

    React.useEffect(() => {
        if (parQ === null || (!parQ.pass && !parQ.consulted)) {
            return;
        }

        // Call boot only if authenticated

        if (!isAuthenticated) {
            return;
        }

        const hydrate = async function () {
            console.log('BOOTING...');
            setHydrating(true);

            const langIndex = localStorage.getItem('lang') ?? '0';

            await dispatch(boot(SUPPORT_LANG[Number(langIndex)]));

            console.log('BOOTED');
            setHydrating(false);
        };

        hydrate();
    }, [isAuthenticated, parQ]);

    if (parQ === null || (!parQ.pass && !parQ.consulted)) {
        return <Redirect to="/parq" />;
    }

    if (!isAuthenticated) {
        if (location.pathname === '/auth/new-password' || location.pathname === '/auth/confirm') {
            return null;
        }

        return <Redirect to="/auth" />;
    } else {
        if (
            location.pathname === '/auth' ||
            location.pathname === '/auth/register' ||
            location.pathname === '/auth/reset-password'
        ) {
            return <Redirect to="/main" />;
        }
    }

    if (hydrating) {
        return <Redirect to="/loading" />;
    }

    if (!isEnrolled) {
        return <Redirect to="/onboarding" />;
    }

    if (!isOnboarded) {
        return <Redirect to="/onboarding/welcome/0" />;
    }

    return <Redirect to="/main" />;
};

const App = function () {
    const [parQ, setParQ] = React.useState(() => {
        const parq = localStorage.getItem('parq');
        return parq === null ? null : JSON.parse(parq);
    });

    return (
        <IonApp>
            <div className="app-wrapper">
                <Provider store={store}>
                    <IonReactRouter>
                        <ThemeProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <IconContext.Provider value={{ weight: 'light', size: 18 }}>
                                    <ColorModeController />
                                    <AppFlowController parQ={parQ} />
                                    <IonRouterOutlet>
                                        <Route path="/parq" exact>
                                            <ParQScreen parQ={parQ} setParQ={setParQ} />
                                        </Route>
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

                                        <Route path="/onboarding/profile" exact>
                                            <NewProfileScreen />
                                        </Route>

                                        <Route path="/onboarding/welcome/:step" exact>
                                            <WelcomeScreen />
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

                                                    <Route path="/main/today" exact>
                                                        <TodayTab />
                                                    </Route>

                                                    <Route path="/main/today" exact>
                                                        <TodayTab />
                                                    </Route>

                                                    <Route path="/main/today/demo/:box" exact>
                                                        <TodayTab />
                                                    </Route>

                                                    <Route path="/main/journal">
                                                        <JournalTab />
                                                    </Route>
                                                    <Route path="/main/settings" exact>
                                                        <AllSettingsTab />
                                                    </Route>

                                                    <Route path="/main/about" exact>
                                                        <AboutThisStudy />
                                                    </Route>

                                                    <Route path="/main/settings/about" exact>
                                                        <SettingsInformationScreen />
                                                    </Route>

                                                    <Route path="/main/settings/profile" exact>
                                                        <EditProfileScreen />
                                                    </Route>
                                                </IonRouterOutlet>

                                                <IonTabBar slot="bottom" className="xb-tab-menu">
                                                    <IonTabButton
                                                        tab="today"
                                                        href="/main/today"
                                                        className="xb-tab-button"
                                                    >
                                                        <ListChecks />
                                                        <IonLabel>{Strings.today}</IonLabel>
                                                    </IonTabButton>
                                                    <IonTabButton tab="box" href="/main/box" className="xb-tab-button">
                                                        <Cube />
                                                        <IonLabel>{Strings.boxes}</IonLabel>
                                                    </IonTabButton>
                                                    <IonTabButton
                                                        tab="journal"
                                                        href="/main/journal"
                                                        className="xb-tab-button"
                                                    >
                                                        <CalendarBlank />
                                                        <IonLabel>{Strings.journal}</IonLabel>
                                                    </IonTabButton>
                                                    <IonTabButton
                                                        tab="settings"
                                                        href="/main/settings"
                                                        className="xb-tab-button"
                                                    >
                                                        <Gear />
                                                        <IonLabel>{Strings.settings}</IonLabel>
                                                    </IonTabButton>
                                                    <IonTabButton
                                                        tab="about"
                                                        href="/main/about"
                                                        className="xb-tab-button"
                                                    >
                                                        <Info />
                                                        <IonLabel>{Strings.about}</IonLabel>
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
            </div>
        </IonApp>
    );
};

export default App;
