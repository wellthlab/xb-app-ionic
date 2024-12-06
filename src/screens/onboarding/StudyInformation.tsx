import Strings from '../../utils/string_dict';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button } from '@mui/joy';

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
