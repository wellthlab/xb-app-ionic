import React from 'react';
import Box from '@mui/material/Box';
import { ListItemDecorator, Button, LinearProgress, Link, Stack, Typography } from '@mui/joy';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Sheet from '@mui/joy/Sheet';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/joy/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { ExperimentCategory, IExperiment } from '../../../models/Experiment';
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
    beginAtUserStartOfWeek,
    currentDay,
}: IExperimentsListProps) {
    const userInCohort = false;
    const [drawerContent, setDrawerContent] = React.useState<any | null>(null);

    const getBody = (experimentCategory: ExperimentCategory, experiments: IExperiment[]) => {
        if (experimentCategory === ExperimentCategory.SCHEDULED && scheduledExperimentsByStartTime && scheduledExperimentsByStartTime.size !== 0) {
            return getScheduledExperimentsBody(experimentCategory);
        } else if (experiments.length !== 0) {
            return getNonScheduledExperimentsBody(experimentCategory, experiments);
        }
    };

    const getScheduledExperimentsBody = (experimentCategory: ExperimentCategory) => {
        return (
            <Box className="experiments-list__scheduled-body" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2 }}>
                {Array.from(scheduledExperimentsByStartTime!)
                    .sort(([startTime1], [startTime2]) => startTime1 - startTime2)
                    .map(([startUTCTime, scheduledExperiments]) =>
                        scheduledExperiments
                            .filter((exp) => exp.days.length > 0)
                            .map((experiment) => (
                                <Box key={experiment.id} className="experiments-list__scheduled-experiment" sx={{ width: '100%' }}>
                                    <Accordion className="experiments-list__accordion" elevation={1} sx={{ width: '100%', backgroundColor: 'rgba(255,255,255,.8)', borderRadius: '10px', overflow: 'hidden' }}>
                                        <AccordionSummary expandIcon={<AddIcon />} className="experiments-list__accordion-summary" sx={{ backgroundColor: 'transparent', px: 2 }}>
                                            <Stack direction="row" spacing={4} sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography className="experiments-list__week-label">Week {experiment.boxweek + 1}</Typography>
                                                <Typography className="experiments-list__week-date">
                                                    <AccessTimeIcon sx={{ mr: 0.5 }} />
                                                    {new Date(startUTCTime).toDateString()}
                                                </Typography>
                                            </Stack>
                                        </AccordionSummary>

                                        <AccordionDetails
                                            className="experiments-list__accordion-details"
                                            sx={{ backgroundColor: 'transparent', px: 2 }}
                                        >
                                            {experiment.desc?.map((item, index) => (
                                                <Stack
                                                    key={index}
                                                    className="experiments-list__section-stack"
                                                    direction="row"
                                                    alignItems="center"
                                                    spacing={1}
                                                    onClick={() => setDrawerContent(item)}
                                                    sx={{ cursor: 'pointer', boxShadow: '0px 2px 6px rgba(0,0,0,0.1)' }}
                                                >
                                                    {item.sectionImageSrc && (
                                                        <img
                                                            src={item.sectionImageSrc}
                                                            alt=""
                                                            className="experiments-list__section-image"
                                                            style={{
                                                                width: '50px',
                                                                height: '50px',
                                                                objectFit: 'cover',
                                                                borderRadius: '4px',
                                                            }}
                                                        />
                                                    )}

                                                    <Typography
                                                        className="experiments-list__section-title"
                                                        sx={{ flex: 1 }}
                                                    >
                                                        {item.sectionTitle}
                                                    </Typography>

                                                    <ListItemDecorator
                                                        sx={{
                                                            ml: 1,
                                                            color: 'text.secondary',
                                                            fontSize: '1.2em',
                                                            transform: 'rotate(-45deg)',
                                                            borderRight: '2px solid currentColor',
                                                            borderBottom: '2px solid currentColor',
                                                            width: '6px',
                                                            height: '6px',
                                                            transition: 'transform 0.2s',
                                                        }}
                                                    />
                                                </Stack>
                                            ))}

                                            <ExperimentTimeline experiment={experiment} currentDay={currentDay} />
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>
                            ))
                    )}
            </Box>
        );
    };

    const getNonScheduledExperimentsBody = (experimentCategory: ExperimentCategory, experiments: IExperiment[]) => {
        return experiments
            .filter((e) => e.days.length > 0)
            .sort((e1, e2) => e1.boxweek - e2.boxweek)
            .map((experiment) => {
                const completion = 0;
                return (
                    <Box key={experiment.id} className="experiments-list__non-scheduled-experiment" sx={{ mx: 'auto', width: '100%', maxWidth: '500px', px: 2, mb: 2 }}>
                        <Accordion className="experiments-list__accordion" elevation={1} sx={{ width: '100%', backgroundColor: 'rgba(255,255,255,.8)', borderRadius: '10px' }}>
                            <AccordionSummary expandIcon={<AddIcon />} className="experiments-list__accordion-summary" sx={{ backgroundColor: 'transparent' }}>
                                <Stack direction="column" spacing={1} className="experiments-list__accordion-summary-stack" sx={{ width: '100%' }}>
                                    <Typography className="experiments-list__week-label" level="h2">
                                        Week {experiment.boxweek + 1}: {experiment.name || '(no experiment name)'}
                                    </Typography>
                                    <Stack direction="row" spacing={2} alignItems="center" className="experiments-list__completion" sx={{ width: '50%' }}>
                                        <Typography className="experiments-list__completion-text" level="body2">
                                            {completion}{Strings.percent_completed}
                                        </Typography>
                                        <LinearProgress className="experiments-list__completion-bar" variant="solid" size="lg" determinate value={completion} sx={{ width: '100px' }} />
                                    </Stack>
                                </Stack>
                            </AccordionSummary>

                            <AccordionDetails
                                className="experiments-list__accordion-details"
                                sx={{ backgroundColor: 'transparent', px: 2 }}
                            >
                                {experiment.desc?.map((item, index) => (
                                    <Stack
                                        key={index}
                                        className="experiments-list__section-stack"
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                        onClick={() => setDrawerContent(item)}
                                        sx={{ cursor: 'pointer', boxShadow: '0px 2px 6px rgba(0,0,0,0.1)' }}
                                    >
                                        {item.sectionImageSrc && (
                                            <img
                                                src={item.sectionImageSrc}
                                                alt=""
                                                className="experiments-list__section-image"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px',
                                                }}
                                            />
                                        )}

                                        <Typography
                                            className="experiments-list__section-title"
                                            sx={{ flex: 1 }}
                                        >
                                            {item.sectionTitle}
                                        </Typography>

                                        <ListItemDecorator
                                            sx={{
                                                ml: 1,
                                                color: 'text.secondary',
                                                fontSize: '1.2em',
                                                transform: 'rotate(-45deg)',
                                                borderRight: '2px solid currentColor',
                                                borderBottom: '2px solid currentColor',
                                                width: '6px',
                                                height: '6px',
                                                transition: 'transform 0.2s',
                                            }}
                                        />
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
        <div className="experiments-list">
            <Stack className="experiments-list__categories">
                {Array.from(experimentsGroupedByCategory).map(([experimentCategory, experiments]) => getBody(experimentCategory, experiments))}
            </Stack>

            <SwipeableDrawer
                anchor="bottom"
                open={!!drawerContent}
                onClose={() => setDrawerContent(null)}
                onOpen={() => { }}
                disableSwipeToOpen={true}
                className="experiments-list__drawer"
                sx={{
                    '--Drawer-horizontalSize': '500px',
                    '& .MuiDrawer-paper': {
                        borderTopLeftRadius: '20px',
                        borderTopRightRadius: '20px',
                        height: '95vh',
                    },
                }}
            >
                <Sheet className="experiments-list__drawer-sheet" sx={{ p: 2, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <IconButton onClick={() => setDrawerContent(null)} className="experiments-list__drawer-close" sx={{ position: 'absolute', right: 8, top: 8, bgcolor: 'transparent', '&:hover': { bgcolor: 'transparent' } }}>
                        <CloseIcon sx={{ color: 'black' }} />
                    </IconButton>

                    <Stack spacing={2} className="experiments-list__drawer-content">
                        {drawerContent && drawerContent.sectionContent.map((element: any, idx: number) => <div key={idx} className="experiments-list__drawer-element">{getContent(element)}</div>)}
                    </Stack>
                </Sheet>
            </SwipeableDrawer>

            {!userInCohort && (
                <div className="experiments-list__subscribe-button-wrapper">
                    <Button style={{ left: '12.5%', width: '70%' }} sx={{ mb: 4, mt: 4, p: 1 }} disabled className="experiments-list__subscribe-button">
                        {Strings.already_subscribed}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ExperimentsList;
