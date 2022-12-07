import React from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Link, TextField } from '@mui/joy';

import SharedAuthScreen from './shared/AuthScreenLayout';

import Form from '../shared/foundation/Form';
import useForm from '../shared/foundation/useForm';

import { registerUser } from '../shared/slices/account';
import { useDispatch } from '../shared/slices/store';

const schema = Yup.object().shape({
    email: Yup.string().required('Email is missing').email('Please input an email address'),
    password: Yup.string()
        .required('Password is missing')
        .min(6, ({ min }) => `Password must have at least ${min} characters`)
        .max(128, ({ max }) => `Password can only have at most ${max} characters`),
    repeatPassword: Yup.string()
        .required('Password confirmation is missing')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
});

const RegisterScreen = function () {
    const { createHandleSubmit, getInputProps, form } = useForm(
        { email: '', password: '', repeatPassword: '' },
        schema,
    );

    const dispatch = useDispatch();
    const handleSubmit = createHandleSubmit(async (data) => {
        const result = await dispatch(registerUser(data));

        if (!registerUser.rejected.match(result)) {
            return;
        }

        if (result.error.message && result.error.message.includes('name already in use')) {
            throw new Error('This email is associated with an account. Please log in instead');
        }

        throw new Error(result.error.message);
    });

    const history = useHistory();
    const handleClickLoginLink = function () {
        history.goBack();
    };

    return (
        <SharedAuthScreen title="Register to continue">
            <Form
                onSubmit={handleSubmit}
                submitLabel="Register"
                errorMessage={form.errors.$root}
                footer={
                    <Link component="button" level="body2" onClick={handleClickLoginLink}>
                        Already had an account? Login
                    </Link>
                }
            >
                <TextField label="Email" {...getInputProps('email')} />
                <TextField label="Password" type="password" {...getInputProps('password')} />
                <TextField label="Repeat password" type="password" {...getInputProps('repeatPassword')} />
            </Form>
        </SharedAuthScreen>
    );
};

export default RegisterScreen;
