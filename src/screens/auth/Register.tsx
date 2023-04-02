import React from 'react';
import { useHistory } from 'react-router-dom';
import { Link, TextField } from '@mui/joy';

import { emailSchema, newPasswordSchema } from './schemas';
import AuthScreenLayout from './AuthScreenLayout';

import Form from '../../components/foundation/Form';
import useForm from '../../components/foundation/useForm';

import { registerUser } from '../../slices/account';
import { useDispatch } from '../../slices/store';

const schema = newPasswordSchema.shape({
    email: emailSchema,
});

const Register = function () {
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
        <AuthScreenLayout title="Register to continue">
            <Form
                onSubmit={handleSubmit}
                submitLabel="Register"
                message={form.errors.$root}
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
        </AuthScreenLayout>
    );
};

export default Register;
