import React from 'react';
import { CircularProgress } from '@mui/joy';

import { Page, Centre } from '../common/ui/layout';

const Loading = function () {
    return (
        <Page>
            <Centre>
                <CircularProgress />
            </Centre>
        </Page>
    );
};

export default Loading;
