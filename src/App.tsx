import React from 'react';
import { Provider } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { CssVarsProvider, CircularProgress, extendTheme, useColorScheme } from '@mui/joy';
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { IconContext, Users, Gear, ForkKnife, Barbell } from 'phosphor-react';

import store, { useSelector, useDispatch } from './slices/store';
import { boot } from './slices/globalActions';
import { selectIsAuthenticated, setIsEnrolled } from './slices/account';
import { Page, Centre } from './common/ui/layout';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import EnrollStudyInformation from './enroll/StudyInformation';
import EnrollConsent from './enroll/EnrollConsent';
import CompleteProfile from './enroll/CompleteProfile';
import SettingsList from './settings/SettingsList';
import EditProfileForm from './settings/EditProfileForm';
import SettingsStudyInformation from './settings/StudyInformation';
import TeamView from './team/TeamView';
import { ModulesList, TasksList } from './box';

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
        return <Redirect to="/enroll" />;
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
                                    <LoginForm />
                                </Route>

                                <Route path="/auth/register" exact>
                                    <RegisterForm />
                                </Route>

                                <Route path="/enroll" exact>
                                    <EnrollStudyInformation />
                                </Route>

                                <Route path="/enroll/consent" exact>
                                    <EnrollConsent />
                                </Route>

                                <Route path="/enroll/profile" exact>
                                    <CompleteProfile />
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
                                                <TeamView />
                                            </Route>

                                            <Route path="/main/box/:type" exact>
                                                <ModulesList />
                                            </Route>

                                            <Route path="/main/box/:type/:moduleId" exact>
                                                <TasksList />
                                            </Route>

                                            <Route path="/main/settings" exact>
                                                <SettingsList />
                                            </Route>

                                            <Route path="/main/settings/about" exact>
                                                <SettingsStudyInformation />
                                            </Route>

                                            <Route path="/main/settings/profile" exact>
                                                <EditProfileForm />
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
