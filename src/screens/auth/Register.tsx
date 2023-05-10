import React from 'react';
import { useHistory } from 'react-router-dom';
import { Link, TextField } from '@mui/joy';

import { emailSchema, newPasswordSchema } from './utils/schemas';
import AuthScreenLayout from './components/AuthScreenLayout';
import ConfirmationRequired from './components/ConfirmationRequired';

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

    const [confirmationRequired, setConfirmationRequired] = React.useState(false);

    const dispatch = useDispatch();
    const handleSubmit = createHandleSubmit(async (data) => {
        if (!data.email.includes('@soton.ac.uk')) {
            throw new Error('You must register with a valid soton.ac.uk email address');
        }

        const result = await dispatch(registerUser(data));

        if (!registerUser.rejected.match(result)) {
            setConfirmationRequired(true);
            return;
        }

        if (result.error.message?.includes('name already in use')) {
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
            {confirmationRequired ? (
                <ConfirmationRequired email={form.values.email} onClickLoginLink={handleClickLoginLink} />
            ) : (
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
                    <TextField label="University email" {...getInputProps('email')} />
                    <TextField label="Password" type="password" {...getInputProps('password')} />
                    <TextField label="Repeat password" type="password" {...getInputProps('repeatPassword')} />
                </Form>
            )}
        </AuthScreenLayout>
    );
};

export default Register;
