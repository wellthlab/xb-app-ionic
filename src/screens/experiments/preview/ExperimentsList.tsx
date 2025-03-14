import React from 'react';
import * as Realm from 'realm-web';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Card, Divider, LinearProgress, Link, Stack, Typography } from '@mui/joy';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Drawer } from '@mui/material';
import Sheet from '@mui/joy/Sheet';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/joy/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import { ExperimentCategory, IExperiment, IExperimentSchedule } from '../../../models/Experiment';
import { useDispatch, useSelector } from '../../../slices/store';
import { selectBoxByExperimentId, selectCompletionForAllExperiments } from '../../../slices/experiments';
import _ from 'lodash';
import Strings from '../../../utils/string_dict';
import Modal from '../../../components/foundation/Modal';
import {
    flagResponsesInactive,
    isUserInCohort,
    reloadResponses,
    saveScheduledExperiments,
    selectProfile,
    selectSubscriptions,
    subscribeToExperiments,
} from '../../../slices/account';
import { DayOfWeek, ISubscription } from '../../../models/Account';
import PageTitle from '../../../components/foundation/PageTitle';
import ReactMarkdown from 'react-markdown';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AddIcon from '@mui/icons-material/Add';
import AccordionDetails from '@mui/material/AccordionDetails';
import YouTubeVideo from '../../../components/TaskModal/YoutubeVideo';
import ExperimentTimeline from './ExperimentTimeline';

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

    const getContent = (block: any) => {
        if (block.type === 'para') {
            return (
                <Typography level="body1" sx={{ fontSize: '0.8rem' }}>
                    {block['content']}
                </Typography>
            );
        }

        if (block.type === 'title') {
            return (
                <Typography level="h5" sx={{ mb: 2, mt: 2, fontWeight: 'lg', fontSize: '0.8rem' }}>
                    {block['content']}
                </Typography>
            );
        }

        if (block.type === 'video') {
            return <YouTubeVideo src={block.src} />;
        }

        if (block.type === 'image') {
            return (
                <img
                    src={block.src}
                    alt={block.alt}
                    style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                />
            );
        }

        if (block.type === 'expandable') {
            return (
                <Accordion>
                    <AccordionSummary expandIcon={<AddIcon />}>
                        <Typography sx={{ mb: 2, mt: 2, fontWeight: 'lg', fontSize: '0.8rem' }}>
                            {block.title}
                        </Typography>
                    </AccordionSummary>

                    <Divider />

                    <AccordionDetails style={{ backgroundColor: '#eeeeee' }}>
                        <br />
                        <Stack spacing={2}>{block.contents.map((element: any) => getContent(element))}</Stack>
                    </AccordionDetails>
                </Accordion>
            );
        }

        if (block.type === 'markdown') {
            return (
                <ReactMarkdown
                    children={block['content']}
                    components={{
                        h1: ({ children }) => <PageTitle>{children}</PageTitle>,

                        h2: ({ children }) => (
                            <Typography level="h4" component="h2" color="primary" sx={{ mt: 4 }}>
                                {children}
                            </Typography>
                        ),
                        li: ({ children }) => <li style={{ marginTop: 2, fontSize: '0.8rem' }}>{children}</li>,
                        p: ({ children }) => <Typography sx={{ mt: 2, fontSize: '0.8rem' }}>{children}</Typography>,

                        a: ({ children, href }) => <Link href={href}>{children}</Link>,
                    }}
                />
            );
        }
    };

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
        return (
            <div>
                {Array.from(scheduledExperimentsByStartTime!)
                    .sort(([startTime1, _], [startTime2, __]) => startTime1 - startTime2)
                    .map(([startUTCTime, scheduledExperiments]) => {
                        return (
                            <Stack spacing={2} alignItems="center">
                                {scheduledExperiments.map((experiment) => {
                                    return (
                                        <Accordion
                                            sx={{
                                                ml: 'auto',
                                                mr: 'auto',
                                                mt: 2,
                                                maxWidth: '90%',
                                                width: '500px',
                                            }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<AddIcon />}
                                                sx={{
                                                    backgroundColor: `rgba(${color})`,
                                                }}
                                            >
                                                <Stack
                                                    direction="row"
                                                    spacing={4}
                                                    sx={{
                                                        width: '90%',
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

                                            <AccordionDetails>
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

                                                        <Link
                                                            textColor="inherit"
                                                            underline="none"
                                                            onClick={() => {
                                                                setDrawerContent(item);
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    flex: 1,
                                                                    fontSize: '0.9rem',
                                                                }}
                                                            >
                                                                {item.sectionTitle}
                                                            </Typography>
                                                        </Link>
                                                    </Stack>
                                                ))}
                                                <ExperimentTimeline experiment={experiment} currentDay={currentDay} />
                                            </AccordionDetails>
                                        </Accordion>
                                    );
                                })}
                            </Stack>
                        );
                    })}
            </div>
        );
    };

    const getNonScheduledExperimentsBody = (experimentCategory: ExperimentCategory, experiments: IExperiment[]) => {
        return (
            <div>
                <Stack spacing={2} alignItems="center">
                    {experiments
                        .sort((e1, e2) => e1.boxweek - e2.boxweek)
                        .map((experiment) => {
                            const completion = 0;
                            return (
                                <Accordion
                                    key={experiment.id}
                                    sx={{
                                        ml: 'auto',
                                        mr: 'auto',
                                        mt: 2,
                                        maxWidth: '90%',
                                        width: '500px',
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<AddIcon />}
                                        sx={{
                                            backgroundColor: `rgba(${color})`,
                                        }}
                                    >
                                        <Stack
                                            direction="column"
                                            spacing={1}
                                            sx={{
                                                width: '90%',
                                            }}
                                        >
                                            <Typography sx={{ fontWeight: 'lg', fontSize: '0.8rem' }}>
                                                Week {experiment.boxweek + 1}: {experiment.name}
                                            </Typography>
                                            {completion !== undefined ? (
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center"
                                                    sx={{ width: '50%' }}
                                                >
                                                    <Typography level="body3" sx={{ fontSize: '0.8rem' }}>
                                                        {completion}
                                                        {Strings.percent_completed}
                                                    </Typography>
                                                    <LinearProgress
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

                                    <AccordionDetails>
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
                                                <Link
                                                    textColor="inherit"
                                                    underline="none"
                                                    onClick={() => {
                                                        setDrawerContent(item);
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            flex: 1,
                                                            fontSize: '0.9rem',
                                                        }}
                                                    >
                                                        {item.sectionTitle}
                                                    </Typography>
                                                </Link>
                                            </Stack>
                                        ))}
                                        <ExperimentTimeline experiment={experiment} currentDay={currentDay} />
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
                </Stack>
            </div>
        );
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
