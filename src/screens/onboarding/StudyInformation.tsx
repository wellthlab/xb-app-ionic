import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button } from '@mui/joy';

import Page from '../../components/foundation/Page';

import AboutThisStudy from '../../components/AboutThisStudy';

const StudyInformation = function () {
    const [canContinue, setCanContinue] = React.useState(false);

    const handleScroll = function (e: React.UIEvent<HTMLElement>) {
        const target = e.currentTarget;

        if (Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 1) {
            setCanContinue(true);
        }
    };

    return (
        <Page sx={{ height: '100%' }}>
            <Box sx={{ flex: 1, overflow: 'auto' }} onScroll={handleScroll}>
                <AboutThisStudy />
            </Box>

            <Button disabled={!canContinue} component={RouterLink} to="/onboarding/consent" sx={{ mt: 2 }} fullWidth>
                {canContinue ? 'Next' : 'Scroll or read to the end to continue'}
            </Button>
        </Page>
    );
};

export default StudyInformation;
