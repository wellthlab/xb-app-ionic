import { IonApp, setupIonicReact } from '@ionic/react';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { LoginErrorCodes, queryKeys } from '@/auth/queries';
import { isRealmErrorCode, isRealmErrorStatusCode } from '@/realm';
import { Router } from '@/router';
import { GlobalStyles } from '@/global-styles';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

setupIonicReact();

const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            if (isRealmErrorStatusCode(error, 401)) {
                queryClient.setQueryData(queryKeys.user, null);
            }
        },
    }),

    mutationCache: new MutationCache({
        onError: (error) => {
            if (isRealmErrorStatusCode(error, 401) && !isRealmErrorCode(error, LoginErrorCodes.Unverified)) {
                queryClient.setQueryData(queryKeys.user, null);
            }
        },
    }),

    defaultOptions: {
        queries: {
            retry: (_, error) => !isRealmErrorStatusCode(error, 401) && !isRealmErrorStatusCode(error, 403),
        },
    },
});

export function App() {
    return (
        <IonApp>
            <QueryClientProvider client={queryClient}>
                <CssVarsProvider defaultMode="system">
                    <CssBaseline />
                    <GlobalStyles />
                    <Router />
                </CssVarsProvider>
            </QueryClientProvider>
        </IonApp>
    );
}
