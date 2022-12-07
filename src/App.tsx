import React from 'react';
import { Provider } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { CssVarsProvider, CircularProgress, extendTheme, useColorScheme } from '@mui/joy';
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { IconContext, Users, Gear, ForkKnife, Barbell } from 'phosphor-react';

import store, { useSelector, useDispatch } from './shared/slices/store';
import { boot } from './shared/slices/globalActions';
import { selectIsAuthenticated, setIsEnrolled } from './shared/slices/account';
import Page from './shared/foundation/Page';
import Centre from './shared/foundation/Centre';

import LoginScreen from './authentication/LoginScreen';
import RegisterScreen from './authentication/RegisterScreen';
import InformationScreen from './onboarding/InformationScreen';
import EnrollConsentScreen from './onboarding/EnrollConsentScreen';
import CompleteProfileScreen from './onboarding/CompleteProfileScreen';
import SettingsTab from './user-settings/SettingsTab';
import EditProfileScreen from './user-settings/EditProfileScreen';
import SettingsInformationScreen from './user-settings/InformationScreen';
import TeamInsightsTab from './team/TeamInsightsTab';
import ModulesList from './box/ModulesList';
import TasksList from './box/TasksList';

const theme = extendTheme({
    components: {
        JoyList: {
            defaultProps: { variant: 'soft' },
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: theme.vars.radius.sm,
                    flex: 0,
                }),
            },
        },

        JoyCard: {
            defaultProps: { variant: 'outlined' },
        },

        JoyContainer: {
            styleOverrides: {
                root: ({ theme }) => ({
                    minHeight: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: theme.spacing(4, 2),
                }),
            },
        },
    },
});

const AppFlowController = function () {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isEnrolled = useSelector(setIsEnrolled);

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

const IonicThemeController = function () {
    const { systemMode, mode } = useColorScheme();

    React.useEffect(() => {
        const toggleBodyClassName = function (suppliedMode: string | undefined) {
            if (suppliedMode === 'dark') {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        };

        if (mode !== 'system') {
            return toggleBodyClassName(mode);
        }

        toggleBodyClassName(systemMode);
    }, [systemMode, mode]);

    return null;
};

const App = function () {
    return (
        <IonApp>
            <Provider store={store}>
                <IonReactRouter>
                    <CssVarsProvider theme={theme} defaultMode="system">
                        <IconContext.Provider value={{ weight: 'light', size: 24 }}>
                            <IonicThemeController />
                            <AppFlowController />
                            <IonRouterOutlet>
                                <Route path="/auth" exact>
                                    <LoginScreen />
                                </Route>

                                <Route path="/auth/register" exact>
                                    <RegisterScreen />
                                </Route>

                                <Route path="/onboarding" exact>
                                    <InformationScreen />
                                </Route>

                                <Route path="/onboarding/consent" exact>
                                    <EnrollConsentScreen />
                                </Route>

                                <Route path="/onboarding/profile" exact>
                                    <CompleteProfileScreen />
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
                                                <Redirect to="/main/team" />
                                            </Route>

                                            <Route path="/main/team" exact>
                                                <TeamInsightsTab />
                                            </Route>

                                            <Route path="/main/box/:type" exact>
                                                <ModulesList />
                                            </Route>

                                            <Route path="/main/box/:type/:moduleId" exact>
                                                <TasksList />
                                            </Route>

                                            <Route path="/main/settings" exact>
                                                <SettingsTab />
                                            </Route>

                                            <Route path="/main/settings/about" exact>
                                                <SettingsInformationScreen />
                                            </Route>

                                            <Route path="/main/settings/profile" exact>
                                                <EditProfileScreen />
                                            </Route>
                                        </IonRouterOutlet>

                                        <IonTabBar slot="bottom">
                                            <IonTabButton tab="team" href="/main/team">
                                                <Users />
                                            </IonTabButton>
                                            <IonTabButton tab="eat" href="/main/box/eat">
                                                <ForkKnife />
                                            </IonTabButton>
                                            <IonTabButton tab="move" href="/main/box/move">
                                                <Barbell />
                                            </IonTabButton>
                                            <IonTabButton tab="settings" href="/main/settings">
                                                <Gear />
                                            </IonTabButton>
                                        </IonTabBar>
                                    </IonTabs>
                                </Route>
                            </IonRouterOutlet>
                        </IconContext.Provider>
                    </CssVarsProvider>
                </IonReactRouter>
            </Provider>
        </IonApp>
    );
};

export default App;
