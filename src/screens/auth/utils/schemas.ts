import * as Yup from 'yup';

export const emailSchema = Yup.string().required('Email is missing').email('Please input an email address').lowercase();

export const newPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .required('Password is missing')
        .min(6, ({ min }) => `Password must have at least ${min} characters`)
        .max(128, ({ max }) => `Password can only have at most ${max} characters`),
    repeatPassword: Yup.string()
        .required('Password confirmation is missing')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
});
