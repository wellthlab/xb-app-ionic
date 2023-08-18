import React from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';
import Form from '../../components/foundation/Form';
import Checkbox from '../../components/foundation/Checkbox';
import useForm from '../../components/foundation/useForm';
import ExerciseWarning from '../../components/ExerciseWarning';

const checkboxSchema = Yup.bool().oneOf([true], 'Please check this box to continue');

const schema = Yup.object().shape({
    c1: checkboxSchema,
    c2: checkboxSchema,
    c3: checkboxSchema,
    c4: checkboxSchema,
});

const Consent = function () {
    const { getCheckboxProps, createHandleSubmit, form } = useForm(
        { c1: false, c2: false, c3: false, c4: false, c5: false, c6: false },
        schema,
    );

    const history = useHistory();
    const handleSubmit = createHandleSubmit(() => {
        history.push('/onboarding/profile');
    });

    return (
        <Page>
            <PageTitle>Just a few things...</PageTitle>

            <Form submitButtonColor="success" submitLabel="Enroll!" message={form.errors.$root} onSubmit={handleSubmit}>
                <Checkbox
                    label="I have read and understood the information sheet (2023-06-09 / V4 of participant information sheet) and have had the opportunity to ask questions about the study."
                    {...getCheckboxProps('c1')}
                />
                <Checkbox
                    label="I agree to take part in this research project and agree for my data to be used for the purpose of this study."
                    {...getCheckboxProps('c2')}
                />
                <Checkbox
                    label="I understand my participation is voluntary and I may withdraw (at any time) for any reason without my participation rights being affected."
                    {...getCheckboxProps('c3')}
                />
                <Checkbox
                    label="I understand that should I withdraw from the study then the information collected about me up to this point may still be used for the purposes of achieving the objectives of the study only."
                    {...getCheckboxProps('c4')}
                />
                <Checkbox
                    label="I understand that I may be quoted directly in reports of the research but that I will not be directly identified (e.g., that my name will not be used)."
                    {...getCheckboxProps('c5')}
                />
                <Checkbox
                    label="I understand that my personal information collected about me such as my name or where I live will not be shared beyond the study team."
                    {...getCheckboxProps('c6')}
                />
            </Form>
        </Page>
    );
};

export default Consent;
