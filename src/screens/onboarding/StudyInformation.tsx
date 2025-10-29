import React from 'react';
import { Box } from '@mui/joy';

import Page from '../../components/foundation/Page';
import AboutThisStudy from '../../components/AboutThisStudy';

const StudyInformation = function () {
    return (
        <Page sx={{ height: '100%' }}>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <AboutThisStudy />
            </Box>
        </Page>
    );
};

export default StudyInformation;
