import { Redirect, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { IonContent, IonPage } from '@ionic/react';
import { Stack, Typography, Button, FormControl, Input, FormLabel, FormHelperText } from '@mui/joy';
import { yupResolver } from '@hookform/resolvers/yup';

import { useResetPassword } from '../queries';
import { newPasswordSchema } from '../schemas';

export default function ResetPasswordPage() {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const token = params.get('token');
    const tokenId = params.get('tokenId');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: 'onTouched',
        resolver: yupResolver(newPasswordSchema),
    });

    const resetPassword = useResetPassword();

    if (!token || !tokenId) {
        console.log('test');
        return <Redirect to="/" />;
    }

    return (
        <IonPage>
            <IonContent>
                <Stack
                    component="form"
                    spacing={5}
                    sx={{ flex: 1 }}
                    onSubmit={handleSubmit((data) => resetPassword.mutate({ token, tokenId, password: data.password }))}
                >
                    <Typography level="h1">Reset password</Typography>
                </Stack>

                <Stack spacing={2} sx={{ flex: 1 }}>
                    <FormControl error={!!errors.password}>
                        <FormLabel>New password</FormLabel>
                        <Input type="password" {...register('password')} />
                        {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                    </FormControl>

                    <FormControl>
                        <FormLabel>Confirm password</FormLabel>
                        <Input type="password" {...register('passwordConfirmation')} />
                        {errors.passwordConfirmation && (
                            <FormHelperText>{errors.passwordConfirmation.message}</FormHelperText>
                        )}
                    </FormControl>
                </Stack>

                <Button loading={resetPassword.isPending}>Reset password</Button>
            </IonContent>
        </IonPage>
    );
}
