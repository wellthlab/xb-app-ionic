import Strings from '../../utils/string_dict';
import React from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';
import Form from '../../components/foundation/Form';
import Checkbox from '../../components/foundation/Checkbox';
import useForm from '../../components/foundation/useForm';

import useStudy from '../../hooks/useStudy';

const checkboxSchema = Yup.bool().oneOf([true], Strings.please_check_this_box_to);

export interface IConsentFormProps {
    isAboutPage: boolean
}
const ConsentForm = function ( {isAboutPage} :  IConsentFormProps) {
    const { study } = useStudy();

   const initialFormState = React.useMemo(
        () =>
            study!.consent.reduce((acc, v, i) => {
                acc[`c${i}`] = isAboutPage;
                return acc;
            }, {} as Record<string, boolean>),
        [study],
    );

    const initialSchema = React.useMemo(() => {
        const schemaKeys = study!.consent.reduce((acc, v, i) => {
            acc[`c${i}`] = checkboxSchema;
            return acc;
        }, {} as Record<string, Yup.AnySchema>);

        return Yup.object().shape(schemaKeys);
    }, [study]);

    const { getCheckboxProps, createHandleSubmit, form } = useForm(initialFormState, initialSchema);

    const history = useHistory();
    const handleSubmit = createHandleSubmit(() => {
        history.push('/onboarding/profile');
    });

    return (
        <Form submitLabel={Strings.next} message={form.errors.$root} onSubmit={handleSubmit} submitDisabled={isAboutPage}>
            {study!.consent.map((statement, i) => (
                <Checkbox isAboutPage={isAboutPage} key={i} label={statement} {...getCheckboxProps(`c${i}`)} />
            ))}
        </Form>
    );
};

export default  ConsentForm;
