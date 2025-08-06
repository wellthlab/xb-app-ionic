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
import { DayOfWeek } from '../../../models/Account';
import PageTitle from '../../../components/foundation/PageTitle';
import ReactMarkdown from 'react-markdown';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AddIcon from '@mui/icons-material/Add';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExperimentTimeline from '../ExperimentTimeline';
import getContent from '../utils/getContent';

interface IExperimentsListProps {
    experimentsGroupedByCategory: Map<ExperimentCategory, IExperiment[]>;
    scheduledExperimentsByStartTime?: Map<number, IExperiment[]>;
    color?: string;
    beginAtUserStartOfWeek: undefined | boolean;
}

const ExperimentsList = function ({
    experimentsGroupedByCategory,
    scheduledExperimentsByStartTime,
    color,
    beginAtUserStartOfWeek,
}: IExperimentsListProps) {
    const completionByExperimentId = useSelector(selectCompletionForAllExperiments);
    const subscriptions = useSelector(selectSubscriptions);
    const { pathname } = useLocation();
    const history = useHistory();
    const userInCohort = useSelector((state) => isUserInCohort(state));
    const [subscriptionModalOpen, setSubscriptionModalOpen] = React.useState(false);
    const [resubscriptionModalOpen, setResubscriptionModalOpen] = React.useState(false);
    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const [drawerContent, setDrawerContent] = React.useState<any | null>(null);

    const isSubscribedToBox = () => {
        const subscribedExperimentIds = Object.keys(subscriptions);
        return !Array.from(experimentsGroupedByCategory.values()).some((experiments) =>
            experiments.some(
                (experiment) =>
                    !subscribedExperimentIds.some((subscribedExperimentId) => subscribedExperimentId === experiment.id),
            ),
        );
    };

    const toggleSubscriptionModal = () => {
        setSubscriptionModalOpen(!subscriptionModalOpen);
    };

    const toggleResubscriptionModal = () => {
        setResubscriptionModalOpen(!resubscriptionModalOpen);
    };

    const handleSubscribeToExperiment = async () => {
        const dayOfWeek = new Date().getUTCDay();
        const userStartOfWeekDay = DayOfWeek[profile!['startOfWeek'] as keyof typeof DayOfWeek].valueOf() + 1;
        const oneDayInMilliSecs = 24 * 60 * 60 * 1000;

        let subscriptionStartTime: number;
        let subscribeToFirstWeekExperiments = false;

        if (!beginAtUserStartOfWeek || dayOfWeek === userStartOfWeekDay) {
            subscriptionStartTime = Date.now();
            subscribeToFirstWeekExperiments = true;
        } else if (dayOfWeek < userStartOfWeekDay) {
            subscriptionStartTime = Date.now() + (userStartOfWeekDay - dayOfWeek) * oneDayInMilliSecs;
        } else {
            subscriptionStartTime = Date.now() + (7 - (dayOfWeek - userStartOfWeekDay)) * oneDayInMilliSecs;
        }

        const experiments = experimentsGroupedByCategory.get(ExperimentCategory.AVAILABLE);
        if (experiments) {
            const firstBoxExperiments = experiments.filter((e) => e.boxweek === 0);

            if (subscribeToFirstWeekExperiments) {
                await dispatch(
                    subscribeToExperiments({
                        experiments: firstBoxExperiments,
                        subscriptionStartTime: subscriptionStartTime,
                    }),
                );
            }

            const oneWeekInMilliSecs = 7 * oneDayInMilliSecs;
            const filteredExperiments = subscribeToFirstWeekExperiments
                ? experiments.filter((e) => e.boxweek !== 0)
                : experiments;
            const scheduledExperiments = filteredExperiments.map((e) => {
                return {
                    startTimeUTC: subscriptionStartTime + e.boxweek * oneWeekInMilliSecs,
                    experiments: [new Realm.BSON.ObjectId(e.id)],
                } as IExperimentSchedule;
            });

            await dispatch(saveScheduledExperiments(scheduledExperiments));
        }
        toggleSubscriptionModal();
    };

    const handleResubscribeToExperiment = async () => {
        const experiments: IExperiment[] = [];
        experimentsGroupedByCategory.forEach((groupedExperiments) => experiments.push(...groupedExperiments));

        const existingSubscriptions = Object.entries(subscriptions)
            .filter((entry) => experiments.some((experiment) => experiment.id === entry[0]))
            .map((entry) => entry[1]);
        await flagResponsesInactive(existingSubscriptions);
        await dispatch(reloadResponses(existingSubscriptions.map((s) => s.id)));
        await dispatch(subscribeToExperiments({ experiments: experiments, subscriptionStartTime: Date.now() }));
        toggleResubscriptionModal();
    };

    const getCategoryTitle = (experimentCategory: ExperimentCategory) => {
        switch (experimentCategory) {
            case ExperimentCategory.ACTIVE:
                return Strings.active_experiments;
            case ExperimentCategory.AVAILABLE:
                return Strings.available_experiments;
            case ExperimentCategory.SUGGESTED:
                return Strings.suggested_experiments;
            case ExperimentCategory.COMPLETED:
                return Strings.completed_experiments;
            case ExperimentCategory.SCHEDULED:
                return Strings.scheduled_experiments;
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
                                {scheduledExperiments
                                    .filter((experiment) => experiment.days.length > 0)
                                    .map((experiment) => {
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
                                                        <Typography sx={{}}>
                                                            Week {experiment.boxweek + 1}
                                                        </Typography>
                                                        <Typography
                                                            sx={{
                                                                fontStyle: 'italic',
                                                            }}
                                                        >
                                                            <AccessTimeIcon
                                                                sx={{
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
                                                                sx={{
                                                                    color: "neutral.900"
                                                                }}
                                                                onClick={() => {
                                                                    setDrawerContent(item);
                                                                }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        flex: 1,
                                                                    }}
                                                                >
                                                                    {item.sectionTitle}
                                                                    ▶
                                                                </Typography>
                                                            </Link>
                                                        </Stack>
                                                    ))}
                                                    <ExperimentTimeline experimentId={experiment.id} />
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
                        .filter((e) => e.days.length > 0)
                        .sort((e1, e2) => e1.boxweek - e2.boxweek)
                        .map((experiment) => {
                            const completion = completionByExperimentId[experiment.id];
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
                                            <Typography level="h2">
                                                Week {experiment.boxweek + 1}: {experiment.name}
                                            </Typography>
                                            {completion !== undefined ? (
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center"
                                                    sx={{ width: '50%' }}
                                                >
                                                    <Typography level="body2" sx={{}}>
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
                                                <Typography sx={{}}>
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
                                                    sx={{
                                                        color: "neutral.900"
                                                    }}
                                                    onClick={() => {
                                                        setDrawerContent(item);
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        {item.sectionTitle}
                                                        &nbsp;▶
                                                    </Typography>
                                                </Link>
                                            </Stack>
                                        ))}
                                        <ExperimentTimeline experimentId={experiment.id} />
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
                </Stack>
            </div>
        );
    };

    const getModalChildren = () => {
        return (
            <div>
                <Typography level="h3"> {Strings.confirm_experiment_subscription} </Typography>
            </div>
        );
    };

    const getResubModalChildren = () => {
        return (
            <div>
                <Typography level="h3"> {Strings.confirm_restart_subscription} </Typography>
                <br />
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

            <Modal
                headerTitle={Strings.confirm_subscription}
                isOpen={subscriptionModalOpen}
                onDismiss={toggleSubscriptionModal}
                className={'ion-modal-small'}
                onAction={handleSubscribeToExperiment}
                children={getModalChildren()}
                actionButtonLabel={Strings.subscribe}
            />

            <Modal
                headerTitle={Strings.confirm_resubscription}
                isOpen={resubscriptionModalOpen}
                onDismiss={toggleResubscriptionModal}
                className={'ion-modal-small'}
                onAction={handleResubscribeToExperiment}
                children={getResubModalChildren()}
                actionButtonLabel={Strings.resubscribe}
            />

            <SwipeableDrawer
                anchor="bottom"
                open={!!drawerContent}
                onClose={() => setDrawerContent(null)}
                onOpen={() => { }}
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
                        onClick={toggleSubscriptionModal}
                        style={{ left: '12.5%', width: '70%' }}
                        sx={{ mb: 4, mt: 4 }}
                        disabled={isSubscribedToBox()}
                    >
                        {isSubscribedToBox() ? Strings.already_subscribed : Strings.subscribe_to_box}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ExperimentsList;
