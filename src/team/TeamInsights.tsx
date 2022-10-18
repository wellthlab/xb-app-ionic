import React from 'react';
import { Typography, Button, Stack } from '@mui/joy';

import { Page, PageTitle } from '../ui/layout';
import { selectFullName } from '../slices/account';
import { selectTeam } from '../slices/team';
import { useSelector } from '../store';

const TeamInsights = function () {
    const fullName = useSelector(selectFullName);
    const team = useSelector(selectTeam);

    let content;

    return <div>Test</div>;
};

export default TeamInsights;
