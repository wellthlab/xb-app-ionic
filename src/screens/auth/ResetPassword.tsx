import React from 'react';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { Link, TextField } from '@mui/joy';

import { emailSchema } from './utils/schemas';
import AuthScreenLayout from './components/AuthScreenLayout';

import Account from '../../models/Account';

import Form from '../../components/foundation/Form';
import useForm from '../../components/foundation/useForm';

const schema = Yup.object().shape({
    email: emailSchema,
});

const ResetPassword = function () {
    const { createHandleSubmit, getInputProps, form } = useForm({ email: '' }, schema);
    const [emailSent, setEmailSent] = React.useState(false);

    const handleSubmit = createHandleSubmit(async ({ email }) => {
        await Account.sendResetPasswordEmail(email);
        setEmailSent(true);
    });

    const history = useHistory();
    const handleClickLoginLink = function () {
        history.goBack();
    };

    return (
        <AuthScreenLayout title="Reset your password">
            <Form
                message={emailSent ? 'If your email is in our records, we will send you an email ' : form.errors.$root}
                messageColor={emailSent ? 'primary' : 'danger'}
                onSubmit={handleSubmit}
                submitLabel="Continue"
                footer={
                    <Link component="button" level="body2" onClick={handleClickLoginLink}>
                        Already had an account? Login
                    </Link>
                }
            >
                <TextField label="Email" {...getInputProps('email')} />
            </Form>
        </AuthScreenLayout>
    );
};

export default ResetPassword;
