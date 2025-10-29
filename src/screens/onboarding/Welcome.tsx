import React from 'react';
import { LinearProgress } from '@mui/material'; //
import { Box, Card, Button, Stack, Typography, AspectRatio } from '@mui/joy';
import { useParams, useHistory } from 'react-router-dom';

import Page from '../../components/foundation/Page';

import { useSelector } from '../../slices/store';

import Strings from '../../utils/string_dict';
import { selectIsEnrolled } from '../../slices/account';
import Study from '../../models/Study';
import { useDispatch } from 'react-redux';
import { markAccountAsOnboarded } from '../../slices/account';

const Welcome = function () {
    const { step: rawStep } = useParams<{ step: string }>();
    const step = rawStep ? Number(rawStep) : 0;
    const study = Study.getCurrentStudy();
    const isEnrolled = useSelector(selectIsEnrolled);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleEnroll = async function () {
        dispatch(markAccountAsOnboarded());
        history.push('/main/box');
    };

    const progressPercent = ((step + 1) / study!.welcome.length) * 100;

    console.log(progressPercent);

    return (
        <Page
            sx={{
                backgroundColor: 'var(--joy-palette-neutral-50)',
            }}
        >
            <Card>
                <LinearProgress
                    variant="determinate"
                    value={progressPercent}
                    sx={{ height: 6, borderRadius: 4, mb: 2 }}
                />
                <Typography level="h1">{study!.welcome[step].title}</Typography>
                <Typography level="body2" sx={{ mt: 1, mb: 2 }}>
                    {(study!.welcome[step]['mainText'] as unknown) as string}
                </Typography>
                <AspectRatio ratio="1">
                    <Box component="img" src={(study!.welcome[step]['image'] as unknown) as string} />
                </AspectRatio>
                <Typography level="body1" sx={{ mt: 2 }}>
                    {(study!.welcome[step]['secondaryText'] as unknown) as string}
                </Typography>

                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mt: 3 }}>
                    <Button
                        onClick={() =>
                            step === 0 ? history.push(`/main/about`) : history.push(`/onboarding/welcome/${step - 1}`)
                        }
                    >
                        {Strings.previous}
                    </Button>

                    {step === study!.welcome.length - 1 ? (
                        <Button onClick={handleEnroll}>
                            {/* Show "Finish" if enrolled, otherwise "Enroll" */}
                            {isEnrolled ? Strings.finish : Strings.enroll}
                        </Button>
                    ) : (
                        <Button onClick={() => history.push(`/onboarding/welcome/${step + 1}`)}>{Strings.next}</Button>
                    )}
                </Stack>
            </Card>
        </Page>
    );
};

export default Welcome;
