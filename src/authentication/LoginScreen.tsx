import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Alert, Link, Box } from '@mui/joy';
import * as Yup from 'yup';

import SharedAuthScreen from './shared/AuthScreenLayout';

import Form from '../shared/foundation/Form';
import useForm from '../shared/foundation/useForm';

import { authenticateUser } from '../shared/slices/account';
import { useDispatch } from '../shared/slices/store';

const schema = Yup.object().shape({
    email: Yup.string().required('Email is missing').email('Please input an email address'),
    password: Yup.string().required('Password is missing'),
});

const LoginScreen = function () {
    const { createHandleSubmit, getInputProps, form } = useForm({ email: '', password: '' }, schema);

    const dispatch = useDispatch();
    const handleSubmit = createHandleSubmit(async (data) => {
        const result = await dispatch(authenticateUser(data));

        if (!authenticateUser.rejected.match(result)) {
            return;
        }

        if (result.error.message && result.error.message.includes('invalid')) {
            throw new Error('Email and password did not match our record');
        }

        throw new Error(result.error.message);
    });

    return (
        <SharedAuthScreen title="Login to continue">
            <Alert color="warning" sx={{ mb: 2 }}>
                We recently made changes to our backend systems. As a result, the app would fail to recognise users
                registered before October 2022. We kindly request such users to reset their passwords by tapping
                "Forgotten password?" below
            </Alert>
            <Form
                onSubmit={handleSubmit}
                submitLabel="Login"
                errorMessage={form.errors.$root}
                footer={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Link component={RouterLink} level="body2" to="/auth/register">
                            Not yet a user? Register
                        </Link>
                        <Link component={RouterLink} level="body2" to="/auth/forgot-password">
                            Forgotten password?
                        </Link>
                    </Box>
                }
            >
                <TextField label="Email" {...getInputProps('email')} />
                <TextField label="Password" type="password" {...getInputProps('password')} />
            </Form>
        </SharedAuthScreen>
    );
};

export default LoginScreen;
