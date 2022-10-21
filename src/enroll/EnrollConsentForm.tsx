import React from 'react';
import { useHistory } from 'react-router-dom';
import { Alert, Link } from '@mui/joy';
import * as Yup from 'yup';

import { Page, PageTitle } from '../common/ui/layout';
import { Form, useForm, Checkbox } from '../common/ui/form';

const checkboxSchema = Yup.bool().oneOf([true], 'Please check this box to continue');

const schema = Yup.object().shape({
    c1: checkboxSchema,
    c2: checkboxSchema,
    c3: checkboxSchema,
    c4: checkboxSchema,
});

const EnrollConsentForm = function () {
    const { getCheckboxProps, createHandleSubmit } = useForm({ c1: false, c2: false, c3: false, c4: false }, schema);

    const history = useHistory();
    const handleSubmit = createHandleSubmit(() => {
        history.push('/enroll/profile');
    });

    return (
        <Page>
            <PageTitle>Just a few things...</PageTitle>

            <Form submitButtonColor="success" submitLabel="Enroll!" onSubmit={handleSubmit}>
                <Checkbox
                    label="I have read the provided participant information and consent to take part in the study"
                    {...getCheckboxProps('c1')}
                />
                <Checkbox
                    label="I am a member of staff at the University of Southampton, and I am at least 18 years old."
                    {...getCheckboxProps('c2')}
                />
                <Checkbox
                    label="I understand that I must be employed in a participating faculty or service, and that in some faculties or services I should discuss or raise participation with my line manager, as directed by my faculty or service."
                    {...getCheckboxProps('c3')}
                />

                <Alert color="warning">
                    <div>
                        Exercise is safe and beneficial for most people, but some people should check with their doctor
                        before changing their physical activity patterns. Use the{' '}
                        <Link href="https://forms.office.com/r/gnYJRRAkRd" target="_blank">
                            PAR Questionnaire
                        </Link>{' '}
                        and/or consult your GP before engaging in physical activity.
                    </div>
                </Alert>

                <Checkbox
                    label="I understand that physical activity can pose the risk of injury, and I have checked that it is safe for me to take part"
                    {...getCheckboxProps('c4')}
                />
            </Form>
        </Page>
    );
};

export default EnrollConsentForm;
