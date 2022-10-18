import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Link, Button } from '@mui/joy';
import ReactMarkdown from 'react-markdown';

import studyInformationMarkdown from './STUDY_INFORMATION.md';

import { Page, PageTitle } from '../ui/layout';

const StudyInformation = function () {
    return (
        <Page>
            <ReactMarkdown
                children={studyInformationMarkdown}
                components={{
                    h1: ({ children }) => <PageTitle>{children}</PageTitle>,

                    h2: ({ children }) => (
                        <Typography level="h4" component="h2" color="primary" sx={{ mt: 4 }}>
                            {children}
                        </Typography>
                    ),

                    p: ({ children }) => <Typography sx={{ mt: 2 }}>{children}</Typography>,

                    a: ({ children, href }) => <Link href={href}>{children}</Link>,
                }}
            />

            <Button component={RouterLink} to="/enroll/consent" sx={{ mt: 4 }} fullWidth>
                Next
            </Button>
        </Page>
    );
};

export default StudyInformation;
