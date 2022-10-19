import React from 'react';

import { PageTitle } from '../common/ui/layout';
import { selectFullName } from '../common/slices/account';
import { useSelector } from '../common/store';

const TeamInsights = function () {
    const fullName = useSelector(selectFullName);

    return <PageTitle>Welcome, {fullName}</PageTitle>;
};

export default TeamInsights;
