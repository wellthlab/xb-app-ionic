import React from 'react';
import { TextField } from '@mui/joy';
import * as Yup from 'yup';

import Form from '../foundation/Form';
import Select from '../foundation/Select';
import useForm from '../foundation/useForm';
import Account from '../models/Account';
import { selectProfile, updateUserProfile } from '../slices/account';
import { useDispatch, useSelector } from '../slices/store';

const schema = Yup.object().shape({
    firstName: Yup.string().required('Your first name is missing'),
    lastName: Yup.string().required('Your last name is missing'),
    department: Yup.string().required('Department is missing'),
    campus: Yup.string(),
    office: Yup.string(),
});

const ProfileForm = function () {
    const profile = useSelector(selectProfile);

    const { getInputProps, createHandleSubmit, form } = useForm(
        { firstName: '', lastName: '', department: '', campus: '', office: '', ...profile },
        schema,
    );

    const dispatch = useDispatch();
    const handleSubmit = createHandleSubmit((data) => {
        return dispatch(updateUserProfile(data)).unwrap();
    });

    return (
        <React.Fragment>
            <Form submitLabel="Let's roll!" errorMessage={form.errors.$root} onSubmit={handleSubmit}>
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
