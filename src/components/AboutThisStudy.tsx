import React from 'react';
import { Typography, Link } from '@mui/joy';
import ReactMarkdown from 'react-markdown';

import PageTitle from './foundation/PageTitle';
import useStudy from '../hooks/useStudy';

const AboutThisStudy = function () {
    const { study, isPending } = useStudy();

    if (isPending) {
        return <div>Loading...</div>;
    }

    return (
        <ReactMarkdown
            children={study!.pis}
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
