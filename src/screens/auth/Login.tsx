import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Alert, Link, Box } from '@mui/joy';
import * as Yup from 'yup';

import { emailSchema } from './schemas';
import AuthScreenLayout from './AuthScreenLayout';

import Form from '../../components/foundation/Form';
import useForm from '../../components/foundation/useForm';

import { authenticateUser } from '../../slices/account';
import { useDispatch } from '../../slices/store';

const schema = Yup.object().shape({
    email: emailSchema,
    password: Yup.string().required('Password is missing'),
});

const Login = function () {
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
        <AuthScreenLayout title="Login to continue">
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
        </AuthScreenLayout>
    );
};

export default Login;
