import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Card, Grid, Box, Link } from '@mui/joy';
import { Barbell, Brain, Ear, ForkKnife, Moon } from 'phosphor-react';

import capitalise from './utils/capitalise';

import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';

const boxes = [
    {
        name: 'eat',
        icon: ForkKnife,
    },
    {
        name: 'move',
        icon: Barbell,
    },
    {
        name: 'engage',
        icon: Ear,
    },
    {
        name: 'cogitate',
        icon: Brain,
    },
    {
        name: 'sleep',
        icon: Moon,
    },
];

const BoxesList = function () {
    return (
        <Page>
            <PageTitle sx={{ mb: 2 }}>Boxes</PageTitle>
            <Typography level="body1" sx={{ mb: 4 }}>
                Welcome to Spring 2023 XB demo! Please choose a box below to get started.
            </Typography>

            <Grid container spacing={1}>
                {boxes.map((box) => {
                    const Icon = box.icon;

                    return (
                        <Grid xs={4} key={box.name}>
                            <Card
                                sx={{
                                    alignItems: 'center',
                                    '&:hover, &:focus-within': {
                                        bgcolor: 'background.level2',
                                    },
                                }}
                            >
                                <Box component={Icon} sx={{ mb: 2 }} />
                                <Link
                                    overlay
                                    textColor="inherit"
                                    underline="none"
                                    component={RouterLink}
                                    to={`/main/box/${box.name}`}
                                >
                                    {capitalise(box.name)}
                                </Link>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Page>
    );
};

export default BoxesList;
