import React from 'react';
import { Button, Stack } from '@mui/joy';
import { useParams, Link } from 'react-router-dom';

import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';
import TaskBlock from '../../components/TaskModal/TaskBlock';

import { useDispatch, useSelector } from '../../slices/store';

import Strings from '../../utils/string_dict';
import { saveScheduledExperiments, subscribeToExperiments, updateUserProfile } from '../../slices/account';
import { selectOnboardingState } from '../../slices/onboarding';
import useStudy from '../../hooks/useStudy';

const Welcome = function () {
    const { step: rawStep } = useParams<{ step: string }>();
    const step = Number(rawStep);
    const { study, isPending: isStudyPending } = useStudy();

    const [isPending, setIsPending] = React.useState(false);

    const updateData = useSelector(selectOnboardingState);
    const dispatch = useDispatch();

    const handleEnroll = async function () {
        setIsPending(true);
        await dispatch(updateUserProfile({ payload: updateData.profile!, cohortId: updateData.cohortId })).unwrap();

        for (const [subscriptionStartTime, experiments] of Object.entries(updateData.experimentsDueForSubscription)) {
            await dispatch(subscribeToExperiments({ experiments: experiments, subscriptionStartTime: Number(subscriptionStartTime) }));
        }
        dispatch(saveScheduledExperiments(updateData.futureExperiments));
        setIsPending(false);
    };

    return (
        <Page>
            <PageTitle>{Strings.welcome}</PageTitle>

            {isStudyPending ? (
                'Loading...'
            ) : (
                <React.Fragment>
                    <Stack spacing={2} flex={1} mb={2}>
                        {study!.welcome[step].map((block, blockId) => (
                            <TaskBlock block={block} key={blockId} />
                        ))}
                    </Stack>

                    {step === study!.welcome.length - 1 ? (
                        <Button loading={isPending} onClick={handleEnroll}>
                            {Strings.enroll}
                        </Button>
                    ) : (
                        <Button component={Link} to={`/onboarding/welcome/${step + 1}`}>
                            {Strings.next}
                        </Button>
                    )}
                </React.Fragment>
            )}
        </Page>
    );
};

export default Welcome;
