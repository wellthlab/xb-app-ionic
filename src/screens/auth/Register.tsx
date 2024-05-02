import Strings from '../../utils/string_dict.js';
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
    email: emailSchema.lowercase(),
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
            throw new Error(Strings.you_must_register_with_a);
        }

        const result = await dispatch(registerUser(data));

        if (!registerUser.rejected.match(result)) {
            setConfirmationRequired(true);
            return;
        }

        if (result.error.message?.includes('name already in use')) {
            throw new Error(Strings.this_email_is_associated_with);
        }

        throw new Error(result.error.message);
    });

    const history = useHistory();
    const handleClickLoginLink = function () {
        history.goBack();
    };

    return (
        <AuthScreenLayout title={Strings.register_to_continue}>
            {confirmationRequired ? (
                <ConfirmationRequired email={form.values.email} onClickLoginLink={handleClickLoginLink} />
            ) : (
                <Form
                    onSubmit={handleSubmit}
                    submitLabel={Strings.register}
                    message={form.errors.$root}
                    footer={
                        <Link component="button" level="body2" onClick={handleClickLoginLink}>
                            {Strings.already_had_an_account_login}
                        </Link>
                    }
                >
                    <TextField label={Strings.university_email} {...getInputProps('email')} />
                    <TextField label={Strings.password} type="password" {...getInputProps('password')} />
                    <TextField label={Strings.repeat_password} type="password" {...getInputProps('repeatPassword')} />
                </Form>
            )}
        </AuthScreenLayout>
    );
};

export default Register;
