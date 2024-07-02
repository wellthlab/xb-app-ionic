import Strings from '../utils/string_dict';
import React from 'react';

import Form from './foundation/Form';
import { useFormFromBlocks } from './foundation/useForm';

import {selectCohortNames, selectProfile} from '../slices/account';
import { useSelector } from '../slices/store';
import useStudy from '../hooks/useStudy';
import TaskBlock from './TaskModal/TaskBlock';
import {
    Alert,
    Checkbox,
    FormControl,
   Input,
    Stack,
} from "@mui/joy";

export interface IProfileFormProps {
    onSubmit: (data: Record<string, string | boolean | number>) => void;
}

const ProfileForm = function ({ onSubmit }: IProfileFormProps) {
    const { isPending } = useStudy();

    if (isPending) {
        return <div>Loading...</div>;
    }

    return <InnerForm onSubmit={onSubmit} />;
};

const InnerForm = function ({ onSubmit }: IProfileFormProps) {
    const { study } = useStudy();
    const profile = useSelector(selectProfile);
    const allCohortNames = useSelector(selectCohortNames);

    const [cohortCode, setCohortCode] = React.useState("");
    const [hasCohortCode, setHasCohortCode] = React.useState(true);
    const [missingCohortCodeAlert, setMissingCohortCodeAlert] = React.useState(false);
    const [invalidCohortCodeAlert, setInvalidCohortCodeAlert] = React.useState(false);


    const { getInputProps, getCheckboxProps, createHandleSubmit, form } = useFormFromBlocks(study!.profile, profile);

    const onFormSubmit = () => {
        if (hasCohortCode && !cohortCode) {
            setInvalidCohortCodeAlert(false);
            setMissingCohortCodeAlert(true);
        } else if (hasCohortCode && !allCohortNames.includes(cohortCode)) {
            setMissingCohortCodeAlert(false);
            setInvalidCohortCodeAlert(true);
        } else {
            createHandleSubmit(onSubmit)();
        }
    }

    return (
        <React.Fragment>
            <Form submitLabel={Strings.lets_roll} message={form.errors.$root} onSubmit={onFormSubmit}>
                {study!.profile.map((block, blockId) => (
                    <TaskBlock block={block} key={blockId} inputs={{ getInputProps, getCheckboxProps }} />
                ))}

                <Stack direction="row" spacing={4} alignItems="center">
                    <FormControl>
                        <Checkbox overlay defaultChecked label={Strings.has_cohort_code} onChange={() => setHasCohortCode(!hasCohortCode)}
                        />
                    </FormControl>
                    <Input value={cohortCode} onChange={(event) => setCohortCode(event.target.value)} placeholder={Strings.cohort_code} disabled={!hasCohortCode} />
                </Stack>
                {missingCohortCodeAlert && <Alert color="danger">
                    {Strings.cohort_code_required}
                </Alert>}
                {invalidCohortCodeAlert && <Alert color="danger">
                    {Strings.cohort_code_invalid}
                </Alert>}
            </Form>
        </React.Fragment>
    );
};

export default ProfileForm;
