import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { Alert, TextField } from '@mui/joy';

import { newPasswordSchema } from './utils/schemas';
import AuthScreenLayout from './components/AuthScreenLayout';
import useTokenAndTokenId from './hooks/useTokenAndTokenId';

import Form from '../../components/foundation/Form';
import useForm from '../../components/foundation/useForm';
import Account from '../../models/Account';

const NewPassword = function () {
    const { token, tokenId } = useTokenAndTokenId();

    const { createHandleSubmit, getInputProps, form } = useForm(
        { password: '', repeatPassword: '' },
        newPasswordSchema,
    );

    const [done, setDone] = React.useState(false);
    const handleSubmit = createHandleSubmit(async ({ password }) => {
        await Account.resetPassword(password, token!, tokenId!);
        setDone(true);
    });

    if (!token || !tokenId) {
        return <Redirect to="/auth" />;
    }

    return (
        <AuthScreenLayout title="New password">
            {done ? (
                <Alert color="success">You have successfully reset your password</Alert>
            ) : (
                <Form onSubmit={handleSubmit} message={form.errors.$root}>
                    <TextField label="New password" type="password" {...getInputProps('password')} />
                    <TextField label="Repeat new password" type="password" {...getInputProps('repeatPassword')} />
                </Form>
            )}
        </AuthScreenLayout>
    );
};

export default NewPassword;
