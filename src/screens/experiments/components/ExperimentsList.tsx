import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Card, LinearProgress, Link, Stack, Typography } from '@mui/joy';

import { ExperimentCategory, IExperiment, IExperimentSchedule } from '../../../models/Experiment';
import { useDispatch, useSelector } from '../../../slices/store';
import { selectCompletionForAllExperiments } from '../../../slices/experiments';
import _ from 'lodash';
import Strings from '../../../utils/string_dict';
import Modal from '../../../components/foundation/Modal';
import {
    flagResponsesInactive,
    isUserInCohort, reloadResponses, saveScheduledExperiments,
    selectSubscriptions,
    subscribeToExperiments,
} from '../../../slices/account';

interface IExperimentsListProps {
    experimentsGroupedByCategory: Map<ExperimentCategory, IExperiment[]>;
    scheduledExperimentsByStartTime?: Map<number, IExperiment[]>;
    color?: string;
}

const ExperimentsList = function ({
    experimentsGroupedByCategory,
    scheduledExperimentsByStartTime,
    color,
}: IExperimentsListProps) {
    const completionByExperimentId = useSelector(selectCompletionForAllExperiments);
    const subscriptions = useSelector(selectSubscriptions);
    const { pathname } = useLocation();
    const history = useHistory();
    const userInCohort = useSelector((state) => isUserInCohort(state));
    const [subscriptionModalOpen, setSubscriptionModalOpen] = React.useState(false);
    const [resubscriptionModalOpen, setResubscriptionModalOpen] = React.useState(false);
    const dispatch = useDispatch();

    const isSubscribedToBox = () => {
        const subscribedExperimentIds = Object.keys(subscriptions);
        return !Array
            .from(experimentsGroupedByCategory.values())
            .some(experiments => experiments
                .some(experiment => !subscribedExperimentIds.some(subscribedExperimentId => subscribedExperimentId === experiment.id)));
    };

    const toggleSubscriptionModal = () => {
        setSubscriptionModalOpen(!subscriptionModalOpen);
    };

    const toggleResubscriptionModal = () => {
        setResubscriptionModalOpen(!resubscriptionModalOpen);
    };

    const handleSubscribeToExperiment = async () => {
        const experiments = experimentsGroupedByCategory.get(ExperimentCategory.AVAILABLE);
        const subscriptionStartTime = Date.now();

        if (experiments) {
            const firstBoxExperiments = experiments.filter(e => e.boxweek === 0);
            await dispatch(subscribeToExperiments({experiments: firstBoxExperiments, subscriptionStartTime: subscriptionStartTime}));

            const oneWeekInMilliSecs = 7 * 24 * 60 * 60 * 1000;
            const scheduledExperiments = experiments.filter(e => e.boxweek !== 0).map(e => {
               return {startTimeUTC: subscriptionStartTime + (e.boxweek * oneWeekInMilliSecs), experiments: [e.id]} as IExperimentSchedule;
            });

            await dispatch(saveScheduledExperiments(scheduledExperiments));
        }
        toggleSubscriptionModal();
    };

    const handleResubscribeToExperiment = async () => {
        const experiments: IExperiment[] = [];
        experimentsGroupedByCategory.forEach(groupedExperiments => experiments.push(...groupedExperiments));

        const existingSubscriptions = Object
            .entries(subscriptions)
            .filter(entry => experiments.some(experiment => experiment.id === entry[0]))
            .map(entry => entry[1]);
        await flagResponsesInactive(existingSubscriptions);
        await dispatch(reloadResponses(existingSubscriptions.map(s => s.id)));
        await dispatch(subscribeToExperiments({experiments: experiments, subscriptionStartTime: Date.now()}));
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
        if (experimentCategory === ExperimentCategory.SCHEDULED && scheduledExperimentsByStartTime && scheduledExperimentsByStartTime.size !== 0 ) {
            return getScheduledExperimentsBody(experimentCategory)
        } else if (experiments.length !== 0)  {
            return getNonScheduledExperimentsBody(experimentCategory, experiments);
        }
    }

    const getExperimentDescFirstParagraph = (experiment: IExperiment) => {
        const sorted = _.sortBy(experiment.desc.filter(d => d['type'] === 'para'), ['index']);
        if (sorted.length > 0) {
            return sorted[0]['content']
        } else {
            return null;
        }
    }
    const getScheduledExperimentsBody = (experimentCategory: ExperimentCategory) => {
        return <Stack spacing={2}>
            <Typography level="h5" sx={{ mb: 2, mt: 2, fontWeight: 'lg', }}>
                {getCategoryTitle(experimentCategory)}
            </Typography>
            <Card variant="outlined">
                {Array.from(scheduledExperimentsByStartTime!)
                    .sort(([startTime1, _], [startTime2, __]) => startTime1 - startTime2 ).map(([startUTCTime, scheduledExperiments]) => {
                        return (
                            <Stack spacing={2}>
                                <Typography level="body1" sx={{ mb: 2, mt: 2, fontWeight: 'lg', textAlign:"center", fontStyle: 'italic' }} > {Strings.starting_on} {new Date(startUTCTime).toDateString()} </Typography>
                                {scheduledExperiments.map(experiment => {
                                    let firstDescPara = getExperimentDescFirstParagraph(experiment);

                                    return (
                                        <Card
                                            key={experiment.id}
                                            variant="outlined"
                                            sx={{
                                                '&:hover, &:focus-within': { bgcolor: 'background.level2' },
                                            }}
                                        >
                                            {experiment.name}
                                            <Stack spacing={1}>
                                                <Link
                                                    overlay
                                                    textColor="inherit"
                                                    underline="none"
                                                    onClick={() => {
                                                        history.push(`${pathname}/${experiment.id}`);
                                                    }}
                                                >
                                                </Link>
                                                {firstDescPara && <Typography level="body2"> {firstDescPara} </Typography>}
                                                <Typography
                                                    level="body3">{experiment.days.length} {Strings.day_s_}</Typography>
                                            </Stack>
                                        </Card>
                                    );
                                })}
                            </Stack>
                        );
                    })
                }
            </Card>

        </Stack>;
    }

    const getNonScheduledExperimentsBody = (experimentCategory: ExperimentCategory, experiments: IExperiment[]) => {
        return <Stack spacing={2}>
            <Typography level="h5" sx={{ mb: 2, mt: 2, fontWeight: 'lg', }}>
                {getCategoryTitle(experimentCategory)}
            </Typography>
            {experiments
                .sort((e1, e2) => e1.boxweek - e2.boxweek )
                .map((experiment) => {
                    let firstDescPara = getExperimentDescFirstParagraph(experiment);
                    const completion = completionByExperimentId[experiment.id];
                    return (
                        <Card
                            key={experiment.id}
                            variant="outlined"
                            sx={{
                                backgroundColor: color || undefined,
                                '&:hover, &:focus-within': { bgcolor: 'background.level2' },
                            }}
                        >
                            {experiment.name}
                            <Stack spacing={1}>
                                <Link
                                    overlay
                                    textColor="inherit"
                                    underline="none"
                                    onClick={() => {
                                        history.push(`${pathname}/${experiment.id}`);
                                    }}
                                >
                                </Link>
                                {firstDescPara && <Typography level="body2"> {firstDescPara} </Typography>}

                                {completion !== undefined ? (
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Typography level="body3">
                                            {completion}
                                            {Strings.percent_completed}
                                        </Typography>
                                        <LinearProgress determinate value={completion} />
                                    </Stack>
                                ) : (
                                    <Typography
                                        level="body3">{experiment.days.length} {Strings.day_s_}</Typography>
                                )}
                            </Stack>
                        </Card>
                    );
                })}
        </Stack>;
    }

    const getModalChildren = () => {
        return <div>
            <Typography level="h6"> {Strings.confirm_experiment_subscription} </Typography>
        </div>
    };

    const getResubModalChildren = () => {
        return <div>
            <Typography level="h6"> {Strings.confirm_restart_subscription} </Typography>
            <br />
        </div>
    };

    return (
        <div>
            <Stack spacing={5}>
                {Array.from(experimentsGroupedByCategory).map(([experimentCategory, experiments]) => {
                    return getBody(experimentCategory, experiments);
                })}
            </Stack>

            {!userInCohort && <Button
                onClick={toggleSubscriptionModal}
                style={{left: "25%", width: "50%"}} sx={{ mb: 2, mt: 4, fontWeight: 'lg', }}
                disabled={isSubscribedToBox()}
            >
                {isSubscribedToBox() ? Strings.already_subscribed : Strings.subscribe_to_box}
            </Button>}

            <Modal
                headerTitle={Strings.confirm_subscription}
                isOpen={subscriptionModalOpen}
                onDismiss={toggleSubscriptionModal}
                className={'ion-modal-small'}
                onAction={handleSubscribeToExperiment}
                children={getModalChildren()}
            />

            <Modal
                headerTitle={Strings.confirm_resubscription}
                isOpen={resubscriptionModalOpen}
                onDismiss={toggleResubscriptionModal}
                className={'ion-modal-small'}
                onAction={handleResubscribeToExperiment}
                children={getResubModalChildren()}
            />

        </div>
    );
};

export default ExperimentsList;
