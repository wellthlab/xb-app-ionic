import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Card, Grid, Box, Link, linkClasses } from '@mui/joy';

import capitalise from './utils/capitalise';

import getIcon from '../../utils/getIcon';
import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';
import { useSelector } from '../../slices/store';
import { selectBoxes } from '../../slices/experiments';

const BoxesList = function () {
    const boxes = useSelector(selectBoxes);

    return (
        <Page>
            <PageTitle sx={{ mb: 2 }}>Boxes</PageTitle>
            <Typography level="body1" sx={{ mb: 4 }}>
                Welcome to Spring 2023 XB demo! Please choose a box below to get started.
            </Typography>

            <Grid container spacing={1}>
                {boxes.map((box) => {
                    const Icon = getIcon(box.icon);

                    return (
                        <Grid xs={4} key={box.name}>
                            <Card
                                sx={{
                                    alignItems: 'center',
                                    ...(box.disabled
                                        ? {}
                                        : {
                                              '&:hover, &:focus-within': {
                                                  bgcolor: 'background.level2',
                                              },
                                          }),
                                }}
                            >
                                <Box
                                    component={Icon}
                                    sx={{ mb: 2 }}
                                    color={box.disabled ? 'neutral.plainDisabledColor' : 'inherit'}
                                />
                                <Link
                                    overlay
                                    textColor="inherit"
                                    underline="none"
                                    component={RouterLink}
                                    to={`/main/box/${box.name}`}
                                    disabled={box.disabled}
                                    sx={{
                                        [`&.${linkClasses.disabled}`]: {
                                            color: 'neutral.plainDisabledColor',
                                        },
                                    }}
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
