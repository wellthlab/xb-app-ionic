import Strings from '../utils/string_dict';
import React from 'react';
import { TextField } from '@mui/joy';
import * as Yup from 'yup';

import Form from './foundation/Form';
import Select from './foundation/Select';
import useForm from './foundation/useForm';

import Account from '../models/Account';

import { selectCohortId, selectProfile, updateUserProfile } from '../slices/account';
import { useDispatch, useSelector } from '../slices/store';

const schema = Yup.object().shape({
    firstName: Yup.string().required(Strings.your_first_name_is_missing),
    lastName: Yup.string().required(Strings.your_last_name_is_missing),
    department: Yup.string().required(Strings.department_is_missing),
    campus: Yup.string(),
    office: Yup.string(),
});

const ProfileForm = function () {
    const profile = useSelector(selectProfile);
    const cohortId = useSelector(selectCohortId);

    const { getInputProps, createHandleSubmit, form } = useForm(
        { firstName: '', lastName: '', department: '', campus: '', office: '', ...profile },
        schema,
    );

    const dispatch = useDispatch();
    const handleSubmit = createHandleSubmit((data) => {
        return dispatch(updateUserProfile({ payload: data, cohortId: cohortId })).unwrap();
    });

    return (
        <React.Fragment>
            <Form submitLabel={Strings.lets_roll} message={form.errors.$root} onSubmit={handleSubmit}>
                <TextField label={Strings.first_name} {...getInputProps('firstName')} />
                <TextField label={Strings.last_name} {...getInputProps('lastName')} />
                <Select label={Strings.department} options={Account.DEPARTMENTS} {...getInputProps('department')} />
                <Select label={Strings.campus} options={Account.CAMPUS} {...getInputProps('campus')} />
                <TextField label={Strings.office} {...getInputProps('office')} />
            </Form>
        </React.Fragment>
    );
};

export default ProfileForm;
