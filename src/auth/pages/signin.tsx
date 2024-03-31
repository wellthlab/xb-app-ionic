import { IonContent, IonPage } from '@ionic/react';
import { Alert, Box, Button, FormControl, FormHelperText, FormLabel, Input, Stack, Typography } from '@mui/joy';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { isRealmErrorCode } from '@/realm';
import { RouterLink } from '@/components/router-link';

import { UnverifiedAccountResult } from '../components/unverified-account-result';
import { loginSchema } from '../schemas';
import { LoginErrorCodes, useLogin } from '../queries';

export default function SigninPage() {
    const login = useLogin();

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm({
        mode: 'onTouched',
        resolver: yupResolver(loginSchema),
    });

    let errorMessage;
    let unverified = false;

    if (login.isError) {
        if (isRealmErrorCode(login.error, LoginErrorCodes.InvalidCredentials)) {
            errorMessage = 'Invalid email or password';
        } else if (isRealmErrorCode(login.error, LoginErrorCodes.Unverified)) {
            unverified = true;
        } else {
            errorMessage = 'There was a problem signing you in. Please try again';
        }
    }

    return (
        <IonPage>
            <IonContent>
                {unverified ? (
                    <UnverifiedAccountResult
                        email={getValues('email')}
                        backButton={<Button onClick={() => login.reset()}>Back to sign in</Button>}
                    />
                ) : (
                    <Stack
                        component="form"
                        spacing={5}
                        sx={{ flex: 1 }}
                        onSubmit={handleSubmit((data) => login.mutate(data))}
                    >
                        <div>
                            <Box
                                component="img"
                                src="/logo.png"
                                alt="XB app logo"
                                sx={{ height: 80, width: 80, mb: 2 }}
                            />
                            <Typography level="h1">Sign in with your Wellthlab account</Typography>
                        </div>

                        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}

                        <Stack spacing={2} sx={{ flex: 1 }}>
                            <FormControl error={!!errors.email}>
                                <FormLabel>Email</FormLabel>
                                <Input autoComplete="email" {...register('email')} />
                                {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
                            </FormControl>

                            <FormControl error={!!errors.password}>
                                <FormLabel>Password</FormLabel>
                                <Input type="password" autoComplete="current-password" {...register('password')} />
                                {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                            </FormControl>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <RouterLink href="/forgot-password" level="body-sm">
                                    Forgot password?
                                </RouterLink>
                            </Box>
                        </Stack>

                        <div>
                            <Button type="submit" fullWidth sx={{ mb: 2 }} loading={login.isPending}>
                                Sign in
                            </Button>

                            <Typography level="body-sm" sx={{ textAlign: 'center' }}>
                                Don't have an account? <RouterLink href="/signup">Sign up</RouterLink>
                            </Typography>
                        </div>
                    </Stack>
                )}
            </IonContent>
        </IonPage>
    );
}
