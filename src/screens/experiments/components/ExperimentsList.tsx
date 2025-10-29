import React from 'react';
import Box from '@mui/material/Box';
import { Link, Stack, Typography } from '@mui/joy';
import Sheet from '@mui/joy/Sheet';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/joy/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { IExperiment } from '../../../models/Experiment';
import Strings from '../../../utils/string_dict';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AddIcon from '@mui/icons-material/Add';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExperimentTimeline from '../ExperimentTimeline';
import getContent from '../utils/getContent';

const ExperimentsList = function ({ experiments }: { experiments: IExperiment[] }) {
    const [drawerContent, setDrawerContent] = React.useState<any | null>(null);

    const renderExperiments = (experiments: IExperiment[]) => {
        return experiments
            .filter((e) => e.days.length > 0)
            .sort((e1, e2) => e1.boxweek - e2.boxweek)
            .map((experiment) => {
                return (
                    <Box
                        key={experiment.id}
                        sx={{
                            mx: 'auto',
                            width: '100%',
                            maxWidth: '500px',
                            px: 2,
                            mb: 2,
                        }}
                    >
                        <Accordion
                            sx={{
                                width: '100%',
                                backgroundColor: 'rgba(255,255,255,.8)',
                                borderRadius: '10px',
                            }}
                        >
                            <AccordionSummary expandIcon={<AddIcon />} sx={{ backgroundColor: 'transparent' }}>
                                <Stack direction="column" spacing={1} sx={{ width: '100%' }}>
                                    <Typography level="h2">
                                        Week {experiment.boxweek + 1}: {experiment.name}
                                    </Typography>

                                    <Typography>
                                        {experiment.days.length} {Strings.day_s_}
                                    </Typography>
                                </Stack>
                            </AccordionSummary>

                            <AccordionDetails sx={{ backgroundColor: 'transparent' }}>
                                {experiment.desc?.map((item, index) => (
                                    <Stack
                                        key={index}
                                        direction="row"
                                        spacing={2}
                                        sx={{
                                            width: '100%',
                                            alignItems: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        {item.sectionImageSrc && (
                                            <img
                                                src={item.sectionImageSrc}
                                                alt=""
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px',
                                                }}
                                            />
                                        )}
                                        <Link
                                            underline="none"
                                            sx={{ color: 'neutral.900' }}
                                            onClick={() => {
                                                setDrawerContent(item);
                                            }}
                                        >
                                            <Typography sx={{ flex: 1 }}>{item.sectionTitle} &nbsp;▶</Typography>
                                        </Link>
                                    </Stack>
                                ))}
                                <ExperimentTimeline experimentId={experiment.id} />
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                );
            });
    };

    return (
        <div>
            <Stack>{renderExperiments(experiments)}</Stack>

            <SwipeableDrawer
                anchor="bottom"
                open={!!drawerContent}
                onClose={() => setDrawerContent(null)}
                onOpen={() => {}}
                disableSwipeToOpen={true}
                sx={{
                    '--Drawer-horizontalSize': '500px',
                    '& .MuiDrawer-paper': {
                        borderTopLeftRadius: '20px',
                        borderTopRightRadius: '20px',
                        height: '95vh',
                    },
                }}
            >
                <Sheet
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                    }}
                >
                    <IconButton
                        onClick={() => setDrawerContent(null)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            bgcolor: 'transparent',
                            '&:hover': {
                                bgcolor: 'transparent',
                            },
                        }}
                    >
                        <CloseIcon sx={{ color: 'black' }} />
                    </IconButton>

                    <Stack spacing={2}>
                        {drawerContent &&
                            drawerContent.sectionContent.map((element: any) => <div>{getContent(element)}</div>)}
                    </Stack>
                </Sheet>
            </SwipeableDrawer>
        </div>
    );
};

export default ExperimentsList;
