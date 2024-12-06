import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/joy';
import { useParams, Link, useHistory } from 'react-router-dom';

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
    const history = useHistory();

    const handleEnroll = async function () {
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
    };

    return (
        <Page>
            {isStudyPending || step === 0 ? '' : <PageTitle>{study!.welcome[step].title}</PageTitle>}

            {isStudyPending ? (
                'Loading...'
            ) : (
                <React.Fragment>
                    <Stack spacing={2} flex={1} mb={2}>
                        {step === 0 ? (
                            <Box sx={{ position: 'relative' }}>
                                <Box sx={{ position: 'relative' }}>
                                    <Box component="img" src="/assets/graphics/welcome.png" />

                                    <Box sx={{ position: 'absolute', inset: 0, p: 2, pt: 6, display: 'flex' }}>
                                        <Box sx={{ m: 'auto', bgcolor: 'rgba(255,255,255,0.8)', p: 2 }}>
                                            <Typography level="h3">
                                                Welcome to your own XB Lab to explore how you can Build, Burn, Recover
                                                Better
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{ position: 'absolute', left: 16, right: 16 }}>
                                    <Box sx={{ top: -32, position: 'absolute', bgcolor: 'white', p: 2 }}>
                                        The following pages offer an overview of how XB – the Experiment in a Box App –
                                        works to help you explore health concepts for yourself – to build up your own
                                        health knowledge skills and practice (KSP) to feel, how you feel, better.
                                    </Box>
                                </Box>
                            </Box>
                        ) : (
                            study!.welcome[step].blocks.map((block, blockId) => (
                                <TaskBlock block={block} key={blockId} />
                            ))
                        )}
                    </Stack>

                    {step === study!.welcome.length - 1 ? (
                        <Button loading={isPending} onClick={handleEnroll}>
                            {Strings.enroll}
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
