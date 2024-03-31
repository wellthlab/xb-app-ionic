import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { Redirect, useLocation } from 'react-router-dom';
import { Stack, Typography, Button } from '@mui/joy';

import { RouterLink } from '@/components/router-link';
import { Loading } from '@/components/loading';

import { useVerifyAccount } from '../queries';

export default function VerifyAccountPage() {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const token = params.get('token');
    const tokenId = params.get('tokenId');

    const verify = useVerifyAccount();

    React.useEffect(() => {
        if (token && tokenId) {
            verify.mutate({ token, tokenId });
        }
    }, []);

    if (!token || !tokenId) {
        return <Redirect to="/" />;
    }

    return (
        <IonPage>
            <IonContent>
                {verify.isPending ? (
                    <Loading />
                ) : (
                    <React.Fragment>
                        <Stack spacing={5} sx={{ flex: 1 }}>
                            <Typography level="h1">
                                {verify.isError ? 'Account verification failed' : 'Account verified successfully'}
                            </Typography>
                            <Typography>
                                {verify.isError
                                    ? 'There was a problem verifying your account. Please sign in and request a new link'
                                    : 'Your account has been verified. Please login to continue'}
                            </Typography>
                        </Stack>

                        <Button component={RouterLink} href="/signin" replace>
                            Sign in
                        </Button>
                    </React.Fragment>
                )}
            </IonContent>
        </IonPage>
    );
}
