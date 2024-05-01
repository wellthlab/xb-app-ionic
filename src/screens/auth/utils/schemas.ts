import Strings from '../../../utils/string_dict.js';
import * as Yup from 'yup';

export const emailSchema = Yup.string().required(Strings.email_is_missing).email(Strings.please_input_an_email_address);

export const newPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .required(Strings.password_is_missing)
        .min(6, ({ min }) => `Password must have at least ${min} characters`)
        .max(128, ({ max }) => `Password can only have at most ${max} characters`),
    repeatPassword: Yup.string()
        .required(Strings.password_confirmation_is)
        .oneOf([Yup.ref('password')], Strings.passwords_must_match),
});
