import Strings from '../../utils/string_dict.js';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Card, Grid, Box, Stack, Link, linkClasses } from '@mui/joy';

import capitalise from './utils/capitalise';

import getIcon from '../../utils/getIcon';
import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';
import { useSelector } from '../../slices/store';
import { selectAllBoxes } from '../../slices/experiments';

const BoxesList = function () {
    const boxes = useSelector(selectAllBoxes);

    return (
        <Page>
            <PageTitle sx={{ mb: 2 }}>{Strings.boxes}</PageTitle>
            <Typography level="body1" sx={{ mb: 4 }}>
                {Strings.welcome_to_spring_2023_xb}
            </Typography>

            <Stack spacing={1}>
                {boxes.map((box) => {
                    const Icon = getIcon(box.icon);

                    return (
                        <Card
                            sx={{
                                alignItems: 'left',
                                ...(box.disabled
                                    ? {}
                                    : {
                                          '&:hover, &:focus-within': {
                                              bgcolor: 'background.level2',
                                          },
                                      }),
                            }}
                        >
                            <Grid container spacing={3}>
                                <Grid xs={3} key="leader" sx={{ borderRight: 1, borderColor: 'divider'}}>
                                    <Grid container textAlign='center' spacing={1}>
                                        <Grid xs={12} key="icon">
                                            <Box
                                                component={Icon}
                                                color={box.disabled ? 'neutral.plainDisabledColor' : 'inherit'}
                                            />
                                        </Grid>
                                        <Grid xs={12} key="name">
                                            <Link
                                                overlay
                                                level="body1"
                                                textColor="inherit"
                                                underline="none"
                                                component={RouterLink}
                                                to={`/main/box/${box.name}`}
                                                disabled={box.disabled}
                                                sx={{
                                                    [`&.${linkClasses.disabled}`]: {
                                                        color: 'neutral.plainDisabledColor',
                                                        align: 'center'
                                                    },
                                                }}
                                            >
                                            {capitalise(box.name)}
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid xs={8} key="body">
                                    <Typography level="body2">
                                        {box.description 
                                            ? box.description
                                            : Strings.box_description1 + capitalise(box.name) + Strings.box_description2
                                        }
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Card>
                    );
                })}
            </Stack>
        </Page>
    );
};

export default BoxesList;
