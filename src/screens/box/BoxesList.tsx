import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Card, Grid, Box, Link } from '@mui/joy';

import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';

import { useSelector } from '../../slices/store';
import { selectAllBoxes } from '../../slices/boxes';
import getIcon from '../../utils/getIcon';

const BoxesList = function () {
    const boxes = useSelector(selectAllBoxes);

    return (
        <Page>
            <PageTitle sx={{ mb: 2 }}>Boxes</PageTitle>
            <Typography level="body2" sx={{ mb: 4 }}>
                Welcome to Spring 2023 XB demo! Please choose a box below to get started.
            </Typography>

            <Grid container spacing={1}>
                {boxes.map((box) => {
                    const Icon = getIcon(box.icon);

                    return (
                        <Grid xs={4} key={box.type}>
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
                                    to={`/main/box/${box.type}`}
                                >
                                    {box.type.toUpperCase()}
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
