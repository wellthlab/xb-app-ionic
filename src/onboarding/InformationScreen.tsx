import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@mui/joy';

import Page from '../shared/foundation/Page';

import AboutThisStudy from '../shared/components/AboutThisStudy';

const InformationScreen = function () {
    return (
        <Page>
            <AboutThisStudy />
            <Button component={RouterLink} to="/enroll/consent" sx={{ mt: 4 }} fullWidth>
                Next
            </Button>
        </Page>
    );
};

export default InformationScreen;
