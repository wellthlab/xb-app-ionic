import { IonContent, IonPage } from '@ionic/react';
import { Alert, Button, FormControl, FormHelperText, FormLabel, Input, Stack, Typography } from '@mui/joy';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { isRealmErrorCode } from '@/realm';
import { RouterLink } from '@/components/router-link';

import { registerSchema } from '../schemas';
import { RegisterErrorCodes, useRegisterUser } from '../queries';
import { UnverifiedAccountResult } from '../components/unverified-account-result';

export default function SignupPage() {
    const registerUser = useRegisterUser();

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm({
        mode: 'onTouched',
        resolver: yupResolver(registerSchema),
    });

    let errorMessage;

    if (registerUser.isError) {
        if (isRealmErrorCode(registerUser.error, RegisterErrorCodes.EmailInUse)) {
            errorMessage = 'This email is associated with an account. Please sign in or try a new email';
        } else {
            errorMessage = 'There was a problem signing you up. Please try again';
        }
    }

    return (
        <IonPage>
            <IonContent>
                {registerUser.isSuccess ? (
                    <UnverifiedAccountResult
                        email={getValues('email')}
                        backButton={
                            <Button component={RouterLink} href="/signin" direction="backward">
                                Back to sign in
                            </Button>
                        }
                    />
                ) : (
                    <Stack
                        component="form"
                        spacing={5}
                        sx={{ flex: 1 }}
                        onSubmit={handleSubmit((data) => registerUser.mutate(data))}
                    >
                        <div>
                            <RouterLink href="/signin" direction="backward" level="body-sm" backIcon sx={{ mb: 2 }}>
                                Already have an account? Sign in
                            </RouterLink>
                            <Typography level="h1">Sign up for a Wellthlab account</Typography>
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
                                <Input type="password" autoComplete="new-password" {...register('password')} />
                                {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                            </FormControl>

                            <FormControl error={!!errors.passwordConfirmation}>
                                <FormLabel>Confirm password</FormLabel>
                                <Input
                                    type="password"
                                    autoComplete="new-password"
                                    {...register('passwordConfirmation')}
                                />
                                {errors.passwordConfirmation && (
                                    <FormHelperText>{errors.passwordConfirmation.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Stack>

                        <Button type="submit" loading={registerUser.isPending}>
                            Sign up
                        </Button>
                    </Stack>
                )}
            </IonContent>
        </IonPage>
    );
}
