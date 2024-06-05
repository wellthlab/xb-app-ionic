import Strings from '../../utils/string_dict';
import React from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';
import Form from '../../components/foundation/Form';
import Checkbox from '../../components/foundation/Checkbox';
import useForm from '../../components/foundation/useForm';
import ExerciseWarning from '../../components/ExerciseWarning';

const checkboxSchema = Yup.bool().oneOf([true], Strings.please_check_this_box_to);

const schema = Yup.object().shape({
    c1: checkboxSchema,
    c2: checkboxSchema,
    c3: checkboxSchema,
    c4: checkboxSchema,
});

const Consent = function () {
    const { getCheckboxProps, createHandleSubmit, form } = useForm(
        { c1: false, c2: false, c3: false, c4: false },
        schema,
    );

    const history = useHistory();
    const handleSubmit = createHandleSubmit(() => {
        history.push('/onboarding/profile');
    });

    return (
        <Page>
            <PageTitle>{Strings.just_a_few_things}</PageTitle>

            <Form submitLabel={Strings.next} message={form.errors.$root} onSubmit={handleSubmit}>
                <Checkbox label={Strings.i_have_read_the_provided} {...getCheckboxProps('c1')} />
                <Checkbox label={Strings.i_am_a_member_of_staff_or_a} {...getCheckboxProps('c2')} />
                <Checkbox label={Strings.i_understand_that_i_must_be} {...getCheckboxProps('c3')} />

                <ExerciseWarning />

                <Checkbox label={Strings.i_understand_that_physical} {...getCheckboxProps('c4')} />
            </Form>
        </Page>
    );
};

export default Consent;
