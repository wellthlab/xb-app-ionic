import React from 'react';
import { Typography, Link, Divider, Stack, Container } from '@mui/joy';
import ReactMarkdown from 'react-markdown';

import PageTitle from './foundation/PageTitle';
import Study from '../models/Study';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AddIcon from '@mui/icons-material/Add';
import AccordionDetails from '@mui/material/AccordionDetails';
import ConsentForm from '../screens/onboarding/Consent';

const AboutThisStudy = function () {
    const study = Study.getCurrentStudy();

    const getContent = (block: any, blockId: number) => {
        if (block.type === 'expandable') {
            return (
                <div key={blockId}>
                    <br />
                    <Accordion>
                        <AccordionSummary expandIcon={<AddIcon />}>
                            <Typography sx={{ mb: 2, mt: 2, fontWeight: 'lg' }}>{block.title}</Typography>
                        </AccordionSummary>

                        <Divider />

                        <AccordionDetails style={{ backgroundColor: '#eeeeee' }} sx={{ padding: 2 }}>
                            <br />
                            <Stack spacing={2}>
                                {block.contents.map((element: any, blockId: number) => getContent(element, blockId))}
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </div>
            );
        }

        if (block.type === 'image') {
            return (
                <div key={block}>
                    <img src={block.src} alt={block.alt} />
                </div>
            );
        } else {
            return (
                <ReactMarkdown
                    key={blockId}
                    children={block.content}
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
        }
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                backgroundColor: '#fff',
                height: 'auto', // Prevent full height
                minHeight: 'unset',
                borderRadius: '10px',
                boxShadow: '2px 4px 5px rgba(0,0,0,.3)',
                py: 3,
            }}
        >
            {study?.studyInfo.map((block, blockId) => getContent(block, blockId))}
            <br />
            <ConsentForm />
        </Container>
    );
};

export default AboutThisStudy;
