import React from 'react';
import { Button, Stack } from '@mui/joy';
import { useParams, Link } from 'react-router-dom';

import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';
import TaskBlock from '../../components/TaskBlock';
import Strings from '../../utils/string_dict';

// TODO: Schema-based configs, perhaps in these proposed formats
// Content schema can re-use task block schema
const content = [
    [
        {
            type: 'para',
            content:
                'Yes, that will be part of "Pick between guided cohort vs individual". Not sure which joining method be yet, we could either use a code or link m.c. Schraefel. I think a link would be more effortless for users, but code would be easier to implement',
        },
        {
            type: 'video',
            src: 'dQw4w9WgXcQ',
        },
    ],
    [
        {
            type: 'para',
            content: 'Step 2',
        },
    ],
] as const;

const Welcome = function () {
    const { step: rawStep } = useParams<{ step: string }>();
    const step = Number(rawStep);

    const lastStep = step === content.length - 1;

    return (
        <Page>
            <PageTitle>{Strings.welcome}</PageTitle>

            <Stack spacing={2} flex={1} mb={2}>
                {content[step].map((block, blockId) => (
                    <TaskBlock block={block} key={blockId} />
                ))}
            </Stack>

            <Button component={Link} to={lastStep ? '/onboarding/profile' : `/onboarding/welcome/${step + 1}`}>
                {lastStep ? "I'm ready!" : 'Next'}
            </Button>
        </Page>
    );
};

export default Welcome;
