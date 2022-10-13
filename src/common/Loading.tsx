import React from 'react';
import { CircularProgress } from '@mui/joy';

import Centre from './layout/Centre';

const Loading = function () {
    return (
        <Centre sx={{ height: '100%', width: '100%' }}>
            <CircularProgress />
        </Centre>
    );
};

export default Loading;
