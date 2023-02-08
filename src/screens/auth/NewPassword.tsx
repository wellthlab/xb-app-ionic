import React from 'react';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { Alert, Button, TextField } from '@mui/joy';

import { newPasswordSchema } from './schemas';
import AuthScreenLayout from './AuthScreenLayout';

import Form from '../../components/foundation/Form';
import useForm from '../../components/foundation/useForm';
import Account from '../../models/Account';

const NewPassword = function () {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const tokenId = params.get('tokenId');

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
