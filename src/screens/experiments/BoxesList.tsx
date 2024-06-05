import Strings from '../../utils/string_dict';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Card, Box, Stack, Link, linkClasses } from '@mui/joy';

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
                                flexDirection: 'row',
                                gap: 3,
                                ...(box.disabled
                                    ? {}
                                    : {
                                          '&:hover, &:focus-within': {
                                              bgcolor: 'background.level2',
                                          },
                                      }),
                            }}
                            key={box.id}
                        >
                            <Stack
                                alignItems="center"
                                minWidth={100}
                                flex={1 / 4}
                                borderRight={1}
                                gap={0.5}
                                borderColor="divider"
                            >
                                <Box component={Icon} color={box.disabled ? 'neutral.plainDisabledColor' : 'inherit'} />
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
                                            align: 'center',
                                        },
                                    }}
                                >
                                    {capitalise(box.name)}
                                </Link>
                            </Stack>

                            <Typography level="body2" flex={1}>
                                {box.description
                                    ? box.description
                                    : Strings.box_description1 + capitalise(box.name) + Strings.box_description2}
                            </Typography>
                        </Card>
                    );
                })}
            </Stack>
        </Page>
    );
};

export default BoxesList;
