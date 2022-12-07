import React from 'react';
import { Typography, Link } from '@mui/joy';
import ReactMarkdown from 'react-markdown';

import studyInformationMarkdown from './STUDY_INFORMATION.md';

import PageTitle from '../../foundation/PageTitle';

const AboutThisStudy = function () {
    return (
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
    );
};

export default AboutThisStudy;
