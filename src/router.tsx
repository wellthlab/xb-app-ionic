import React from 'react';
import { Redirect, Route } from 'react-router';
import { IonReactRouter } from '@ionic/react-router';
import { IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, useIonRouter } from '@ionic/react';
import { Cube, Gear, HouseSimple, Notebook } from '@phosphor-icons/react';

import { Loading } from '@/components/loading';
import { useUser } from '@/auth/queries';

// Auth pages

const SigninPage = React.lazy(() => import('@/auth/pages/signin'));
const SignupPage = React.lazy(() => import('@/auth/pages/signup'));
const ForgotPasswordPage = React.lazy(() => import('@/auth/pages/forgot-password'));
const VerifyAccountPage = React.lazy(() => import('@/auth/pages/verify-account'));
const ResetPasswordPage = React.lazy(() => import('@/auth/pages/reset-password'));

// Onboarding pages

const StudyDescriptionPage = React.lazy(() => import('@/onboarding/pages/study-description'));
const ConsentPage = React.lazy(() => import('@/onboarding/pages/consent'));
const JoinACohortPage = React.lazy(() => import('@/onboarding/pages/join-a-cohort'));

// Settings pages

const AllSettingsPage = React.lazy(() => import('@/settings/pages/all-settings'));

function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
    const router = useIonRouter();
    const { data: user, isSuccess, isPending, isError } = useUser();

    React.useEffect(() => {
        if (!isSuccess || user) {
            return;
        }

        // Use window.location here instead of useLocation() because useLocation() triggers an extra re-render
        // which causes redirection to happen twice (and incorrectly)

        const destination = encodeURIComponent(window.location.pathname + window.location.search);
        router.push(`/signin?continue=${destination}`, 'none', 'replace');
    }, [!!user, isSuccess]);

    if (isPending) {
        return <Loading />;
    }

    if (isError) {
        return <div>Error</div>;
    }

    if (!user) {
        return null;
    }

    return children;
}

function AnonymousRoute({ children }: { children: React.ReactNode }) {
    const { data: user, isSuccess, isPending, isError } = useUser();
    const router = useIonRouter();

    React.useEffect(() => {
        if (!isSuccess || !user) {
            return;
        }

        // Use window.location due to the reason above

        const destination = new URLSearchParams(window.location.search).get('continue') || '/';
        router.push(destination, 'none', 'replace');
    }, [user, isSuccess]);

    if (isPending) {
        return <Loading />;
    }

    if (isError) {
        return <div>Error</div>;
    }

    if (user) {
        return null;
    }

    return children;
}

function LazyRoute({ children }: { children: React.ReactNode }) {
    return <React.Suspense fallback={<Loading />}>{children}</React.Suspense>;
}

function OnboardedRoute({ children }: { children: React.ReactNode }) {
    const { data: user } = useUser();

    if (!user.cohort) {
        return <Redirect to="/onboarding/study" />;
    }

    return children;
}

export function Router() {
    return (
        <IonReactRouter>
            <IonRouterOutlet>
                <Redirect exact from="/" to="/app" />

                <Route exact path="/signin">
                    <AnonymousRoute>
                        <LazyRoute>
                            <SigninPage />
                        </LazyRoute>
                    </AnonymousRoute>
                </Route>

                <Route exact path="/signup">
                    <AnonymousRoute>
                        <LazyRoute>
                            <SignupPage />
                        </LazyRoute>
                    </AnonymousRoute>
                </Route>

                <Route exact path="/forgot-password">
                    <AnonymousRoute>
                        <LazyRoute>
                            <ForgotPasswordPage />
                        </LazyRoute>
                    </AnonymousRoute>
                </Route>

                <Route exact path="/verify-account">
                    <LazyRoute>
                        <VerifyAccountPage />
                    </LazyRoute>
                </Route>

                <Route exact path="/reset-password">
                    <LazyRoute>
                        <ResetPasswordPage />
                    </LazyRoute>
                </Route>

                <Route exact path="/onboarding/study">
                    <AuthenticatedRoute>
                        <LazyRoute>
                            <StudyDescriptionPage />
                        </LazyRoute>
                    </AuthenticatedRoute>
                </Route>

                <Route exact path="/onboarding/consent">
                    <AuthenticatedRoute>
                        <LazyRoute>
                            <ConsentPage />
                        </LazyRoute>
                    </AuthenticatedRoute>
                </Route>

                <Route exact path="/onboarding/join-a-cohort">
                    <AuthenticatedRoute>
                        <LazyRoute>
                            <JoinACohortPage />
                        </LazyRoute>
                    </AuthenticatedRoute>
                </Route>

                <Route path="/app">
                    <Redirect exact from="/app" to="/app/home" />
                    <AuthenticatedRoute>
                        <OnboardedRoute>
                            <IonTabs>
                                <IonRouterOutlet>
                                    <Route exact path="/app/home">
                                        <div>Home</div>
                                    </Route>

                                    <Route exact path="/app/box">
                                        <div>Box</div>
                                    </Route>

                                    <Route exact path="/app/journal">
                                        <LazyRoute>
                                            <div>Journal</div>
                                        </LazyRoute>
                                    </Route>

                                    <Route exact path="/app/settings">
                                        <LazyRoute>
                                            <AllSettingsPage />
                                        </LazyRoute>
                                    </Route>
                                </IonRouterOutlet>

                                <IonTabBar slot="bottom">
                                    <IonTabButton tab="home" href="/app/home">
                                        <HouseSimple size={20} />
                                        <IonLabel>Home</IonLabel>
                                    </IonTabButton>
                                    <IonTabButton tab="box" href="/app/box">
                                        <Cube size={20} />
                                        <IonLabel>Box</IonLabel>
                                    </IonTabButton>
                                    <IonTabButton tab="journal" href="/app/journal">
                                        <Notebook size={20} />
                                        <IonLabel>Journal</IonLabel>
                                    </IonTabButton>
                                    <IonTabButton tab="settings" href="/app/settings">
                                        <Gear size={20} />
                                        <IonLabel>Settings</IonLabel>
                                    </IonTabButton>
                                </IonTabBar>
                            </IonTabs>
                        </OnboardedRoute>
                    </AuthenticatedRoute>
                </Route>
            </IonRouterOutlet>
        </IonReactRouter>
    );
}
