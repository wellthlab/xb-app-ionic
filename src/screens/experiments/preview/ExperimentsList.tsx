import React from 'react';
import Box from '@mui/material/Box';
import { Button, LinearProgress, Link, Stack, Typography } from '@mui/joy';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Sheet from '@mui/joy/Sheet';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/joy/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { ExperimentCategory, IExperiment } from '../../../models/Experiment';
import _ from 'lodash';
import Strings from '../../../utils/string_dict';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AddIcon from '@mui/icons-material/Add';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExperimentTimeline from './ExperimentTimeline';
import getContent from '../utils/getContent';

interface IExperimentsListProps {
    experimentsGroupedByCategory: Map<ExperimentCategory, IExperiment[]>;
    scheduledExperimentsByStartTime?: Map<number, IExperiment[]>;
    color?: string;
    beginAtUserStartOfWeek: undefined | boolean;
    currentDay: number;
}

const ExperimentsList = function ({
    experimentsGroupedByCategory,
    scheduledExperimentsByStartTime,
    color,
    beginAtUserStartOfWeek,
    currentDay,
}: IExperimentsListProps) {
    const userInCohort = false;
    const [drawerContent, setDrawerContent] = React.useState<any | null>(null);

    const getBody = (experimentCategory: ExperimentCategory, experiments: IExperiment[]) => {
        if (
            experimentCategory === ExperimentCategory.SCHEDULED &&
            scheduledExperimentsByStartTime &&
            scheduledExperimentsByStartTime.size !== 0
        ) {
            return getScheduledExperimentsBody(experimentCategory);
        } else if (experiments.length !== 0) {
            return getNonScheduledExperimentsBody(experimentCategory, experiments);
        }
    };

const getScheduledExperimentsBody = (experimentCategory: ExperimentCategory) => {
    return Array.from(scheduledExperimentsByStartTime!)
        .sort(([startTime1], [startTime2]) => startTime1 - startTime2)
        .flatMap(([startUTCTime, scheduledExperiments]) =>
            scheduledExperiments.map((experiment) => (
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
                            <Stack
                                direction="row"
                                spacing={4}
                                sx={{
                                    width: '100%',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography sx={{ fontWeight: 'lg', fontSize: '0.8rem' }}>
                                    Week {experiment.boxweek + 1}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontWeight: 'lg',
                                        fontSize: '0.8rem',
                                        fontStyle: 'italic',
                                    }}
                                >
                                    <AccessTimeIcon
                                        sx={{
                                            fontSize: '0.9rem',
                                            verticalAlign: 'middle',
                                            mr: 0.5,
                                        }}
                                    />
                                    {new Date(startUTCTime).toDateString()}
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
                                        textColor="inherit"
                                        underline="none"
                                        onClick={() => {
                                            setDrawerContent(item);
                                        }}
                                    >
                                        <Typography sx={{ flex: 1, fontSize: '0.9rem' }}>
                                            {item.sectionTitle}&nbsp;▶
                                        </Typography>
                                    </Link>
                                </Stack>
                            ))}
                            <ExperimentTimeline experiment={experiment} currentDay={currentDay} />
                        </AccordionDetails>
                    </Accordion>
                </Box>
            ))
        );
};

    
const getNonScheduledExperimentsBody = (experimentCategory: ExperimentCategory, experiments: IExperiment[]) => {
    return experiments
        .sort((e1, e2) => e1.boxweek - e2.boxweek)
        .map((experiment) => {
            const completion = 0; // adjust as needed
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
                        <AccordionSummary
                            expandIcon={<AddIcon />}
                            sx={{ backgroundColor: 'transparent' }}
                        >
                            <Stack
                                direction="column"
                                spacing={1}
                                sx={{ width: '90%' }}
                            >
                                <Typography sx={{ fontWeight: 'lg', fontSize: '0.8rem' }}>
                                    Week {experiment.boxweek + 1}: {experiment.name || '(no experiment name)'}
                                </Typography>
                                {completion !== undefined ? (
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                        sx={{ width: '50%' }}
                                    >
                                        <Typography level="body3" sx={{ fontSize: '0.8rem' }}>
                                            {completion}{Strings.percent_completed}
                                        </Typography>
                                        <LinearProgress
                                            variant="solid"
                                            size='lg'
                                            determinate
                                            value={completion}
                                            sx={{ width: '100px' }}
                                        />
                                    </Stack>
                                ) : (
                                    <Typography sx={{ fontWeight: 'lg', fontSize: '0.8rem' }}>
                                        {experiment.days.length} {Strings.day_s_}
                                    </Typography>
                                )}
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
                                        textColor="inherit"
                                        underline="none"
                                        onClick={() => setDrawerContent(item)}
                                    >
                                        <Typography sx={{ flex: 1, fontSize: '0.9rem' }}>
                                            {item.sectionTitle}&nbsp;▶
                                        </Typography>
                                    </Link>
                                </Stack>
                            ))}
                            <ExperimentTimeline experiment={experiment} currentDay={currentDay} />
                        </AccordionDetails>
                    </Accordion>
                </Box>
            );
        });
};

    return (
        <div>
            <Stack>
                {Array.from(experimentsGroupedByCategory).map(([experimentCategory, experiments]) => {
                    return getBody(experimentCategory, experiments);
                })}
            </Stack>

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

            {!userInCohort && (
                <div>
                    <Button
                        style={{ left: '12.5%', width: '70%' }}
                        sx={{ mb: 2, mt: 4, fontWeight: 'lg', fontSize: '0.8rem' }}
                        disabled
                    >
                        {Strings.already_subscribed}
                    </Button>
                    <br />
                    <br />
                    <br />
                </div>
            )}
        </div>
    );
};

export default ExperimentsList;
