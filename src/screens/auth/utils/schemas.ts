import Strings from '../../../utils/string_dict.js';
import * as Yup from 'yup';

export const emailSchema = Yup.string().required(Strings.email_is_missing).email(Strings.please_input_an_email_address);

export const newPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .required(Strings.password_is_missing)
        .min(6, ({ min }) => Strings.password_must_have_at_least+' '+min+' '+Strings.password_must_have_at_least_2)
        .max(128, ({ max }) => Strings.password_can_only_have_at+' '+max+' '+Strings.password_can_only_have_at_2),
    repeatPassword: Yup.string()
        .required(Strings.password_confirmation_is)
        .oneOf([Yup.ref('password')], Strings.passwords_must_match),
});
