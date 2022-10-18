import React from 'react';
import { Typography, Button, Stack } from '@mui/joy';

import { Page, PageTitle } from '../common/ui/layout';
import { selectFullName } from '../common/slices/account';
import { selectTeam } from '../common/slices/team';
import { useSelector } from '../common/store';

const TeamInsights = function () {
    const fullName = useSelector(selectFullName);
    const team = useSelector(selectTeam);

    let content;

    return <div>Test</div>;
};

export default TeamInsights;
