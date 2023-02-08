import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@mui/joy';

import Page from '../../components/foundation/Page';

import AboutThisStudy from '../../components/AboutThisStudy';

const StudyInformation = function () {
    return (
        <Page>
            <AboutThisStudy />
            <Button component={RouterLink} to="/onboarding/consent" sx={{ mt: 4 }} fullWidth>
                Next
            </Button>
        </Page>
    );
};

export default StudyInformation;
