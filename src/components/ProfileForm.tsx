import Strings from '../utils/string_dict';
import React from 'react';

import Form from './foundation/Form';
import { useFormFromBlocks } from './foundation/useForm';
import { setExperimentsDueForSubscription, setFutureExperiments } from '../slices/onboarding';

import {
    getScheduledCohortExperiments, selectCohortId,
    selectCohortNames,
    selectProfile,
} from '../slices/account';
import { useDispatch, useSelector } from '../slices/store';
import useStudy from '../hooks/useStudy';
import TaskBlock from './TaskModal/TaskBlock';
import {
    Alert,
    Checkbox,
    FormControl,
   Input,
    Stack,
} from "@mui/joy";
import { selectAllExperiments } from '../slices/experiments';
import { DayOfWeek, ICohort } from '../models/Account';
import Select from './foundation/Select';

export interface IProfileFormProps {
    onSubmit: (data: Record<string, string | boolean | number>) => void;
    cohortIdRef: React.MutableRefObject<string | undefined>
    startOfWeekRef: React.MutableRefObject<string | undefined>
    isNewProfile?: boolean
}

const ProfileForm = function ({ onSubmit, cohortIdRef, startOfWeekRef, isNewProfile = true }: IProfileFormProps ) {
    const { isPending } = useStudy();

    if (isPending) {
        return <div>Loading...</div>;
    }

    return <InnerForm onSubmit={onSubmit} cohortIdRef ={cohortIdRef} isNewProfile={isNewProfile} startOfWeekRef={startOfWeekRef}/>;
};

const InnerForm = function ({ onSubmit, cohortIdRef, isNewProfile, startOfWeekRef }: IProfileFormProps) {
    const { study } = useStudy();
    const profile = useSelector(selectProfile);
    const cohortId = useSelector(selectCohortId);
    const allCohortNames = useSelector(selectCohortNames);
    const existingCohortName = allCohortNames
        .find(elem => (elem as ICohort).id === cohortId);
    const allExperiments = useSelector(selectAllExperiments);
    const dispatch = useDispatch();

    const [cohortCode, setCohortCode] = React.useState( existingCohortName ? (existingCohortName as ICohort).name : "");
    const [startOfWeek, setStartOfWeek] = React.useState('Monday');

    const [hasCohortCode, setHasCohortCode] = React.useState(isNewProfile || !!cohortId);
    const [missingCohortCodeAlert, setMissingCohortCodeAlert] = React.useState(false);
    const [invalidCohortCodeAlert, setInvalidCohortCodeAlert] = React.useState(false);


    const { getInputProps, getCheckboxProps, createHandleSubmit, form } = useFormFromBlocks(study!.profile, profile);

    const onFormSubmit = async () => {
        const trimmedCohortCode = cohortCode.trim();
        if (hasCohortCode) {
            if (!trimmedCohortCode) {
                setInvalidCohortCodeAlert(false);
                setMissingCohortCodeAlert(true);
            } else if (!allCohortNames.some(elem => (elem as ICohort).name === trimmedCohortCode)) {
                setMissingCohortCodeAlert(false);
                setInvalidCohortCodeAlert(true);
            } else {
                const [experimentsDueForSubscription, futureExperiments] = await getScheduledCohortExperiments(trimmedCohortCode, Object.values(allExperiments));
                dispatch(setExperimentsDueForSubscription(experimentsDueForSubscription));
                dispatch(setFutureExperiments(futureExperiments));
                cohortIdRef.current = trimmedCohortCode;
                createHandleSubmit(onSubmit)();
            }
        } else {
            startOfWeekRef.current = startOfWeek;
            createHandleSubmit(onSubmit)();
        }
    }

    return (
        <React.Fragment>
            <Form submitLabel={Strings.lets_roll} message={form.errors.$root} onSubmit={onFormSubmit}>
                {study!.profile.map((block, blockId) => (
                    <TaskBlock block={block} key={blockId + Number(hasCohortCode)} inputs={{ getInputProps, getCheckboxProps }} />
                ))}


                {!hasCohortCode && <Select label={'Start of Week'} options={Object.values(DayOfWeek)} value={startOfWeek} onChange={(event) => {setStartOfWeek(event.target.value)}}/>}

                <Stack spacing={2} alignItems="center">
                    <FormControl >
                        <Checkbox overlay defaultChecked={isNewProfile || !!cohortId} label={Strings.has_cohort_code} onChange={() => setHasCohortCode(!hasCohortCode)} disabled = {!isNewProfile}
                        />
                    </FormControl>
                    <Input fullWidth={true} value={cohortCode} onChange={(event) => setCohortCode(event.target.value)} placeholder={Strings.cohort_code} disabled={!isNewProfile || !hasCohortCode} />
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
