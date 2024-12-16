import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/joy';
import { useParams, Link, useHistory } from 'react-router-dom';

import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';
import TaskBlock from '../../components/TaskModal/TaskBlock';

import { useDispatch, useSelector } from '../../slices/store';

import Strings from '../../utils/string_dict';
import {
    saveScheduledExperiments,
    selectIsEnrolled,
    subscribeToExperiments,
    updateUserProfile,
} from '../../slices/account';
import { selectOnboardingState } from '../../slices/onboarding';
import useStudy from '../../hooks/useStudy';

const Welcome = function () {
    const { step: rawStep } = useParams<{ step: string }>();
    const step = rawStep ? Number(rawStep) : 0;
    const { study, isPending: isStudyPending } = useStudy();
    const isEnrolled = useSelector(selectIsEnrolled);

    const [isPending, setIsPending] = React.useState(false);

    const updateData = useSelector(selectOnboardingState);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleEnroll = async function () {
        if (isEnrolled) {
            history.push('/main/box');
        } else {
            setIsPending(true);
            await dispatch(updateUserProfile({ payload: updateData.profile!, cohortId: updateData.cohortId })).unwrap();

            for (const [subscriptionStartTime, experiments] of Object.entries(updateData.experimentsDueForSubscription)) {
                await dispatch(
                    subscribeToExperiments({
                        experiments: experiments,
                        subscriptionStartTime: Number(subscriptionStartTime),
                    }),
                );
            }
            if (updateData.futureExperiments.length > 0) {
                dispatch(saveScheduledExperiments(updateData.futureExperiments));
            }
            setIsPending(false);
        }
    };

    return (
        <Page>
            {isStudyPending  ? '' :
                <PageTitle>
                    <Typography level="h5">
                     {study!.welcome[step].title}
                    </Typography>
                </PageTitle>}
            {isStudyPending ? (
                'Loading...'
            ) : (
                <React.Fragment>
                    <Stack spacing={2} flex={1} mb={2}>
                        <Box sx={{ position: 'relative' }}>
                            <Box sx={{ position: 'relative' }}>
                                <Box component="img" src={study!.welcome[step]['image'] as unknown as string} />

                                <Box sx={{ position: 'absolute', inset: 0, p: 2, pt: 1, display: 'flex' }}>
                                    <Box sx={{ m: 'auto', bgcolor: 'rgba(255,255,255,0.8)', p: 2 }}>
                                        <Typography level="body2">
                                            {study!.welcome[step]['mainText'] as unknown as string}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{ position: 'absolute', left: 16, right: 16 }}>
                                <Box sx={{ top: -32, position: 'absolute', bgcolor: 'white', p: 2 }}>
                                    <Typography level="body2">
                                    {study!.welcome[step]['secondaryText'] as unknown as string}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Stack>

                    {step === study!.welcome.length - 1 ? (
                        <Button loading={isPending} onClick={handleEnroll}>
                            {isEnrolled ? Strings.next : Strings.enroll}
                        </Button>
                    ) : (
                        <Button onClick={() => history.push(`/onboarding/welcome/${step + 1}`)}>{Strings.next}</Button>
                    )}
                </React.Fragment>
            )}
        </Page>
    );
};

export default Welcome;
