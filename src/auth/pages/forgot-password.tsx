import { IonPage, IonContent } from '@ionic/react';
import { Alert, Box, Button, FormControl, FormHelperText, FormLabel, Input, Stack, Typography } from '@mui/joy';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { isRealmErrorCode } from '@/realm';
import { RouterLink } from '@/components/router-link';

import { emailSchema } from '../schemas';
import { PasswordResetErrorCodes, useSendRecoveryEmail } from '../queries';

export default function ForgotPasswordPage() {
    const sendRecoveryEmail = useSendRecoveryEmail();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: 'onTouched',
        resolver: yupResolver(emailSchema),
    });

    let errorMessage;

    if (sendRecoveryEmail.isError) {
        if (isRealmErrorCode(sendRecoveryEmail.error, PasswordResetErrorCodes.EmailNotFound)) {
            errorMessage = 'This email is not associated with an account. Please try again with another email';
        } else {
            errorMessage = 'There was a problem finding your user account. Please try again';
        }
    }

    return (
        <IonPage>
            <IonContent>
                {sendRecoveryEmail.isSuccess ? (
                    <Stack spacing={5} sx={{ flex: 1 }}>
                        <Typography level="h1">Check your email</Typography>

                        <Box sx={{ flex: 1 }}>
                            <Typography>
                                We have sent you an email with instructions on how to reset your password. It should be
                                in your inbox shortly.
                            </Typography>
                        </Box>

                        <Button component={RouterLink} href="/signin" direction="backward">
                            Back to login
                        </Button>
                    </Stack>
                ) : (
                    <Stack
                        component="form"
                        spacing={5}
                        sx={{ flex: 1 }}
                        onSubmit={handleSubmit(async (data) => sendRecoveryEmail.mutateAsync(data))}
                    >
                        <div>
                            <RouterLink href="/signin" direction="backward" level="body-sm" backIcon sx={{ mb: 2 }}>
                                Sign in
                            </RouterLink>
                            <Typography level="h1">Find your account</Typography>
                        </div>

                        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}

                        <Box sx={{ flex: 1 }}>
                            <FormControl error={!!errors.email}>
                                <FormLabel>Email</FormLabel>
                                <Input {...register('email')} />
                                <FormHelperText>
                                    {errors.email?.message || 'Use the email you have signed up with'}
                                </FormHelperText>
                            </FormControl>
                        </Box>

                        <Button type="submit" loading={sendRecoveryEmail.isPending}>
                            Continue
                        </Button>
                    </Stack>
                )}
            </IonContent>
        </IonPage>
    );
}
