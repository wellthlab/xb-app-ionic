import React from 'react';
import { Alert, TextField } from '@mui/joy';
import * as Yup from 'yup';

import { Form, useForm, Select } from '../common/ui/form';
import { Page, PageTitle } from '../common/ui/layout';
import Account from '../common/models/Account';
import { completeProfile } from '../common/slices/account';
import { useDispatch } from '../common/store';

const schema = Yup.object().shape({
    firstName: Yup.string().required('Your first name is missing'),
    lastName: Yup.string().required('Your last name is missing'),
    department: Yup.string().required('Department is missing'),
    campus: Yup.string(),
    office: Yup.string(),
});

const CompleteProfileForm = function () {
    const { getInputProps, createHandleSubmit } = useForm(
        { firstName: '', lastName: '', department: '', campus: '', office: '' },
        schema,
    );

    const dispatch = useDispatch();
    const handleSubmit = createHandleSubmit((data) => {
        return dispatch(completeProfile(data));
    });

    return (
        <Page>
            <PageTitle>Your profile</PageTitle>
            <Alert sx={{ mb: 2 }}>We just need a bit of your personal information to get started</Alert>
            <Form submitLabel="Let's roll!" onSubmit={handleSubmit}>
                <TextField label="First name" {...getInputProps('firstName')} />
                <TextField label="Last name" {...getInputProps('lastName')} />
                <Select label="Department" options={Account.DEPARTMENTS} {...getInputProps('department')} />
                <Select label="Campus" options={Account.CAMPUS} {...getInputProps('campus')} />
                <TextField label="Office" {...getInputProps('office')} />
            </Form>
        </Page>
    );
};

export default CompleteProfileForm;
