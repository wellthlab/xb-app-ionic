import React from 'react';
import {Typography, Link, Divider, Stack} from '@mui/joy';
import ReactMarkdown from 'react-markdown';

import PageTitle from './foundation/PageTitle';
import useStudy from '../hooks/useStudy';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AddIcon from "@mui/icons-material/Add";
import AccordionDetails from "@mui/material/AccordionDetails";
import Page from "./foundation/Page";
import ConsentForm from "../screens/onboarding/Consent";

const AboutThisStudy = function () {
    const { study, isPending } = useStudy();

    if (isPending) {
        return <div>Loading...</div>;
    }

    const getContent = (block: any) => {
        if (block.type === 'expandable') {
            return <div>
                <br/>
                <Accordion>
                    <AccordionSummary expandIcon={<AddIcon />}>
                        <Typography
                            sx={{ mb: 2, mt: 2, fontWeight: 'lg' }}>
                            {block.title}
                        </Typography>
                    </AccordionSummary>

                    <Divider />

                    <AccordionDetails style={{ backgroundColor: '#eeeeee' }}  sx={{padding: 2}}>
                        <br />
                        <Stack spacing={2}>
                            {block.contents.map((element: any) => (
                                getContent(element)
                            ))}
                        </Stack>
                    </AccordionDetails>
                </Accordion>
            </div>

        } else {
            return  <ReactMarkdown
                children={block.contents}
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
        }
    };

    return (
        <Page>
            {study?.studyInfo.map(block => getContent(block))}
            <br/>
            <ConsentForm />
        </Page>
    );
};

export default AboutThisStudy;
