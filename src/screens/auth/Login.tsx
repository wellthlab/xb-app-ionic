import Strings from '../../utils/string_dict.js';
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

const schema = Yup.object().shape({
    email: emailSchema,
    password: Yup.string().required(Strings.password_is_missing),
});

const Login = function () {
    const { createHandleSubmit, getInputProps, form } = useForm({ email: '', password: '' }, schema);

    const [confirmationRequired, setConfirmationRequired] = React.useState(false);

    const dispatch = useDispatch();
    const handleSubmit = createHandleSubmit(async (data) => {
        const result = await dispatch(authenticateUser(data));

        if (!authenticateUser.rejected.match(result)) {
            return;
        }

        if (result.error.message?.includes('invalid')) {
            throw new Error(Strings.email_or_password_did_not);
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
        <AuthScreenLayout title={Strings.login_to_continue}>
            {confirmationRequired ? (
                <ConfirmationRequired email={form.values.email} onClickLoginLink={handleClickLoginLink} />
            ) : (
                <Form
                    onSubmit={handleSubmit}
                    submitLabel={Strings.login}
                    message={form.errors.$root}
                    footer={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Link component={RouterLink} level="body2" to="/auth/register">
                                {Strings.not_yet_a_user_register}
                            </Link>
                            <Link component={RouterLink} level="body2" to="/auth/reset-password">
                                {Strings.forgotten_password}
                            </Link>
                        </Box>
                    }
                >
                    <TextField label={Strings.email} {...getInputProps('email')} />
                    <TextField label={Strings.password} type="password" {...getInputProps('password')} />
                </Form>
            )}
        </AuthScreenLayout>
    );
};

export default Login;
