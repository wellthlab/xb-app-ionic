import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Link, Box } from '@mui/joy';
import * as Yup from 'yup';

import { emailSchema } from './utils/schemas';
import AuthScreenLayout from './components/AuthScreenLayout';
import ConfirmationRequired from './components/ConfirmationRequired';

import Form from '../../components/foundation/Form';
import useForm from '../../components/foundation/useForm';

import { authenticateUser } from '../../slices/account';
import { useDispatch } from '../../slices/store';
import Account from '../../models/Account';
import { fcmService } from '../../index';

const schema = Yup.object().shape({
    email: emailSchema,
    password: Yup.string().required('Password is missing'),
});

const Login = function () {
    const { createHandleSubmit, getInputProps, form } = useForm({ email: '', password: '' }, schema);

    const [confirmationRequired, setConfirmationRequired] = React.useState(false);

    const dispatch = useDispatch();
    const handleSubmit = createHandleSubmit(async (data) => {
        const result = await dispatch(authenticateUser(data));

        if (!authenticateUser.rejected.match(result)) {
            const fcmDeviceToken = fcmService.getFCMDeviceToken();
            if (fcmDeviceToken) {
                Account.updateFCMDeviceToken(fcmDeviceToken);
            }
            return;
        }

        if (result.error.message?.includes('invalid')) {
            throw new Error('Email or password did not match our record');
        }

        if (result.error.message?.includes('confirmation required')) {
            Account.resendConfirmationEmail(data.email);
            setConfirmationRequired(true);
            return;
        }

        throw new Error(result.error.message);
    });

    const handleClickLoginLink = function () {
        setConfirmationRequired(false);
    };

    return (
        <AuthScreenLayout title="Login to continue">
            {confirmationRequired ? (
                <ConfirmationRequired email={form.values.email} onClickLoginLink={handleClickLoginLink} />
            ) : (
                <Form
                    onSubmit={handleSubmit}
                    submitLabel="Login"
                    message={form.errors.$root}
                    footer={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Link component={RouterLink} level="body2" to="/auth/register">
                                Not yet a user? Register
                            </Link>
                            <Link component={RouterLink} level="body2" to="/auth/reset-password">
                                Forgotten password?
                            </Link>
                        </Box>
                    }
                >
                    <TextField label="Email" {...getInputProps('email')} />
                    <TextField label="Password" type="password" {...getInputProps('password')} />
                </Form>
            )}
        </AuthScreenLayout>
    );
};

export default Login;
