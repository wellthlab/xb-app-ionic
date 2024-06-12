import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Card, LinearProgress, Link, List, ListItem, ListItemContent, Stack, Typography } from '@mui/joy';

import { ExperimentCategory, GenericExperiment } from '../../../models/Experiment';
import { useDispatch, useSelector } from '../../../slices/store';
import { selectCompletionForAllExperiments } from '../../../slices/experiments';
import Strings from '../../../utils/string_dict';
import Modal from '../../../components/foundation/Modal';
import { selectSubscriptions, subscribeToExperiments } from '../../../slices/account';

interface IExperimentsListProps {
    experimentsGroupedByCategory: Map<ExperimentCategory, GenericExperiment[]>;
}

const ExperimentsList = function({
                                     experimentsGroupedByCategory,
                                 }: IExperimentsListProps) {
    const completionByExperimentId = useSelector(selectCompletionForAllExperiments);
    const subscriptions = useSelector(selectSubscriptions);
    const { pathname } = useLocation();
    const history = useHistory();
    const [parentExperimentSubscriptionModalOpen, setParentExperimentSubscriptionModalOpen] = React.useState(false);
    const dispatch = useDispatch();

    const isSubscribedToParentExperiment = () => {
        return experimentsGroupedByCategory
            .get(ExperimentCategory.SUB_EXPERIMENT)
            ?.every(experiment =>  Object.keys(subscriptions).includes(experiment.id));
    }
    const toggleParentExperimentSubscriptionModal = () => {
        setParentExperimentSubscriptionModalOpen(!parentExperimentSubscriptionModalOpen);
    };

    const handleSubscribeToParentExperiment = async () => {
        await dispatch(subscribeToExperiments(experimentsGroupedByCategory.get(ExperimentCategory.SUB_EXPERIMENT)!));
        toggleParentExperimentSubscriptionModal();
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
            case ExperimentCategory.SUB_EXPERIMENT:
                return Strings.sub_experiments;
        }
    };

    const isSubExperiments  = () => {
        return experimentsGroupedByCategory.has(ExperimentCategory.SUB_EXPERIMENT);
    }

    const getParentExperimentSubscriptionModal = () => {
        return <div>
            <Typography level="h6"> {Strings.confirm_parent_experiment_subscription} </Typography>
            <br />
            {experimentsGroupedByCategory.get(ExperimentCategory.SUB_EXPERIMENT)?.map((experiment, _) => {
                return <List >
                    <ListItem key={experiment.name}  sx={{ mb: 2}}>
                        <ListItemContent>
                            <Typography style={{ fontStyle: 'italic' }}>
                                {experiment.name} - {experiment.duration} {Strings.days_long}
                            </Typography>
                        </ListItemContent>
                    </ListItem>
                </List>
            })}
        </div>
    };

    return (
        <div>
            <Stack spacing={5}>
                {Array.from(experimentsGroupedByCategory).map(([experimentCategory, experiments]) => {
                    return experiments.length === 0 ?
                        <Stack>
                            <Typography level="h6" sx={{ mb: 2, mt: 2, fontWeight: 'lg', }}>
                                {getCategoryTitle(experimentCategory)}
                            </Typography>
                            <Card key={experimentCategory} variant="outlined">
                                <Typography level="body2" textAlign="center">
                                    <br /> {Strings.no_experiments_in_category}<br /><br />
                                </Typography>
                            </Card>
                        </Stack>
                        : <Stack spacing={2}>
                            <Typography level="h5" sx={{ mb: 2, mt: 2, fontWeight: 'lg', }}>
                                {getCategoryTitle(experimentCategory)}
                            </Typography>
                            {experiments
                                .map((experiment) => {
                                    const completion = completionByExperimentId[experiment.id];
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
                                                {experiment.desc &&
                                                    <Typography level="body2">
                                                        {experiment.desc}
                                                    </Typography>}
                                                {completion !== undefined ? (
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Typography
                                                            level="body3">{completion}{Strings.percent_completed}</Typography>
                                                        <LinearProgress determinate value={completion} />
                                                    </Stack>
                                                ) : (
                                                    <Typography
                                                        level="body3">{experiment.duration}{Strings.day_s_}</Typography>
                                                )}
                                            </Stack>
                                        </Card>
                                    );
                                })}
                        </Stack>;
                })}
            </Stack>
            {isSubExperiments() && <Button onClick={toggleParentExperimentSubscriptionModal} disabled={isSubscribedToParentExperiment()} style={{left: "25%", width: "50%"}} sx={{ mb: 2, mt: 4, fontWeight: 'lg', }}> {Strings.subscribe_to_parent_experiment} </Button>}


            <Modal
                headerTitle={Strings.confirm_subscription}
                isOpen={parentExperimentSubscriptionModalOpen}
                onDismiss={toggleParentExperimentSubscriptionModal}
                onAction={handleSubscribeToParentExperiment}
                children={getParentExperimentSubscriptionModal()}
            />
        </div>
    );
};

export default ExperimentsList;
