import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, List, ListItem, ListItemContent, Stack, Typography } from '@mui/joy';

import capitalise from './utils/capitalise';

import ExperimentsList from './components/ExperimentsList';

import Page from '../../components/foundation/Page';
import ExerciseWarning from '../../components/ExerciseWarning';

import { useDispatch, useSelector } from '../../slices/store';
import { selectAllBoxes, selectExperimentByBoxName } from '../../slices/experiments';
import { GenericExperiment } from '../../models/Experiment';
import Modal from '../../components/foundation/Modal';
import {
    selectSubscriptions,
    selectSubscriptionSequenceByBoxId,
    subScribeToBox,
    unSubscribeFromBox,
} from '../../slices/account';
import { boot } from '../../slices/globalActions';

const ExperimentsListScreen = function() {
    const { type } = useParams<{ type: string }>();
    const dispatch = useDispatch();

    const experiments = useSelector((state) => selectExperimentByBoxName(state, type));
    const boxId = useSelector(selectAllBoxes).find(box => box.name === type)!.id;
    const existingSelections = useSelector((state) => selectSubscriptionSequenceByBoxId(state, boxId));
    const subscriptions = useSelector(selectSubscriptions);

    const [subscriptionModalOpen, setSubscriptionModalOpen] = React.useState(false);
    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();
    const [experimentSelections, setExperimentSelections] = React.useState(existingSelections);

    const handleExperimentSelected = function(experiment: GenericExperiment, isSelected: boolean) {
        const newExperimentSelections = new Map(experimentSelections);
        if (isSelected) {
            if (newExperimentSelections.has(experiment.boxWeek)) {
                if (!newExperimentSelections.get(experiment.boxWeek)!.some(e => e.id === experiment.id)) {
                    newExperimentSelections.get(experiment.boxWeek)!.push(experiment);
                }
            } else {
                newExperimentSelections.set(experiment.boxWeek, [experiment]);
            }
        } else if (newExperimentSelections.has(experiment.boxWeek)) {
            const filterExperiments = newExperimentSelections.get(experiment.boxWeek)!.filter(e => !(e.id === experiment.id));
            if (filterExperiments.length === 0) {
                newExperimentSelections.delete(experiment.boxWeek);
            } else {
                newExperimentSelections.set(experiment.boxWeek, filterExperiments);
            }
        }
        setExperimentSelections(newExperimentSelections);
    };

    const isCheckBoxSelected = (boxWeek: number, experimentId: string) => {
        const experimentsForWeek = experimentSelections.get(boxWeek);
        return !experimentsForWeek ? false : experimentsForWeek.some(experiment => experiment.id === experimentId);
    };

    const toggleSubscriptionModal = () => {
        setSubscriptionModalOpen(!subscriptionModalOpen);

    };

    const handleSubscribeToBox = () => {
        subScribeToBox(dispatch, experimentSelections, boxId);
        toggleSubscriptionModal();
    };

    const handleUnsubscribeFromBox = async () => {
        const subscriptionIds: string[] = [];
        Array.from(experimentSelections.values()).flat().forEach(experiment => {
            if ('children' in experiment) {
                experiment.children.forEach((childExperiment) => subscriptions[childExperiment] && subscriptionIds.push(subscriptions[childExperiment].id));
            } else {
                subscriptions[experiment.id] && subscriptionIds.push(subscriptions[experiment.id].id);
            }
        });

        await unSubscribeFromBox(subscriptionIds, boxId);
        dispatch(boot());
        toggleSubscriptionModal();
    };

    const onAction = () => {
        if (isSubscribedToBox()) {
            handleUnsubscribeFromBox();
        } else {
            handleSubscribeToBox();
        }
    };

    const getModalChildren = () => {
        if (isSubscribedToBox()) {
            return <Typography component="span" display="inline" level="body1"> Are you sure you want to restart this
                subscription?. You will lose all progress with your current subscription !</Typography>;
        } else {
            return <div>
                <Typography level="h6"> Do you want to subscribe to these selected experiments: </Typography>
                <br />
                <br />
                <List>
                    {
                        Array.from(experimentSelections.values()).flat().map((experiment) => {
                            return <ListItem key={experiment.boxWeek + experiment.name}>
                                <ListItemContent>
                                    <Typography>
                                        Week {experiment.boxWeek + 1} - {experiment.name}
                                    </Typography>
                                </ListItemContent>
                            </ListItem>;
                        })
                    }
                </List>
            </div>;
        }
    };

    const getConfirmationText = () => {
        if (isSubscribedToBox()) {
            return 'Restart subscription for this box';
        } else {
            return 'Subscribe to this box';
        }
    };

    const isSubscribedToBox = () => {
        return !(existingSelections.size === 0);
    };

    return (
        <Page headerTitle={`${capitalise(type)} experiments`} sx={{ position: 'relative' }} ref={setPresentingElement}>
            <Stack spacing={2}>
                {type === 'move' && <ExerciseWarning />}

                <ExperimentsList
                    experiments={experiments.filter((item) => !('parent' in item) || !item.parent)}
                    onExperimentSelected={handleExperimentSelected}
                    isCheckBoxSelected={isCheckBoxSelected}
                    isSubscribedToBox={isSubscribedToBox()}
                />
                <br />
            </Stack>

            <br />
            <Button onClick={toggleSubscriptionModal} disabled={experimentSelections.size === 0}> {getConfirmationText()} </Button>

            <Modal
                headerTitle="Confirm Subscription"
                isOpen={subscriptionModalOpen}
                presentingElement={presentingElement}
                onDismiss={toggleSubscriptionModal}
                onAction={onAction}
                children={getModalChildren()}
                className={isSubscribedToBox() ? 'ion-modal-small' : ''}
            />

        </Page>
    );
};

export default ExperimentsListScreen;
