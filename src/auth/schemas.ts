import * as Y from 'yup';

export const emailSchema = Y.object({
    email: Y.string().lowercase().required('Email is missing').email('Please input an email address'),
});

export const newPasswordSchema = Y.object({
    password: Y.string()
        .required('Password is missing')
        .min(6, ({ min }) => `Password must have at least ${min} characters`)
        .max(128, ({ max }) => `Password can only have at most ${max} characters`),

    passwordConfirmation: Y.string()
        .required('Password confirmation is missing')
        .oneOf([Y.ref('password')], 'Passwords must match'),
});

export const loginSchema = emailSchema.shape({
    password: Y.string().required('Password is missing'),
});

export const registerSchema = emailSchema.concat(newPasswordSchema);
