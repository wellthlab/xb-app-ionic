import React from 'react';
import { Typography, Button, Stack } from '@mui/joy';

import { Page, PageTitle } from '../common/page';
import { selectFullName } from '../state/account';
import { selectTeam } from '../state/team';
import { useSelector } from '../store';
import { Centre } from '../common/layout';

const TeamInsights = function () {
    const fullName = useSelector(selectFullName);
    const team = useSelector(selectTeam);

    let content;

    if (!team) {
        content = (
            <Centre sx={{ flex: 1 }}>
                <Stack spacing={2}>
                    <Typography>You have not joined a team yet</Typography>
                    <Button>Join</Button>
                </Stack>
            </Centre>
        );
    }

    return (
        <Page sx={{ display: 'flex', flexDirection: 'column' }}>
            <PageTitle>Welcome, {fullName}</PageTitle>
            {content}
        </Page>
    );
};

export default TeamInsights;
