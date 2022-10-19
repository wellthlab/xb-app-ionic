import React from 'react';
import { Alert, TextField } from '@mui/joy';
import * as Yup from 'yup';

import { Form, useForm, Select } from '../ui/form';
import Account from '../models/Account';
import { updateUserProfile } from '../slices/account';
import { useDispatch } from '../store';

const schema = Yup.object().shape({
    firstName: Yup.string().required('Your first name is missing'),
    lastName: Yup.string().required('Your last name is missing'),
    department: Yup.string().required('Department is missing'),
    campus: Yup.string(),
    office: Yup.string(),
});

export interface IProfileFormProps {
    defaultValues?: {
        firstName?: string;
        lastName?: string;
        department?: string;
        campus?: string;
        office?: string;
    };

    info: string;
}

const ProfileForm = function ({ defaultValues, info }: IProfileFormProps) {
    const { getInputProps, createHandleSubmit } = useForm(
        { firstName: '', lastName: '', department: '', campus: '', office: '', ...defaultValues },
        schema,
    );

    const dispatch = useDispatch();
    const handleSubmit = createHandleSubmit((data) => {
        return dispatch(updateUserProfile(data)).unwrap();
    });

    return (
        <React.Fragment>
            <Alert sx={{ mb: 2 }}>{info}</Alert>
            <Form submitLabel="Let's roll!" onSubmit={handleSubmit}>
                <TextField label="First name" {...getInputProps('firstName')} />
                <TextField label="Last name" {...getInputProps('lastName')} />
                <Select label="Department" options={Account.DEPARTMENTS} {...getInputProps('department')} />
                <Select label="Campus" options={Account.CAMPUS} {...getInputProps('campus')} />
                <TextField label="Office" {...getInputProps('office')} />
            </Form>
        </React.Fragment>
    );
};

export default ProfileForm;
