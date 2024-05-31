import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, List, ListItem, ListItemContent, Stack, Typography } from '@mui/joy';

import capitalise from './utils/capitalise';

import ExperimentsList from './components/ExperimentsList';

import Page from '../../components/foundation/Page';
import ExerciseWarning from '../../components/ExerciseWarning';

import { useDispatch, useSelector } from '../../slices/store';
import { selectAllBoxes, selectAllExperiments, selectExperimentByBoxName } from '../../slices/experiments';
import { GenericExperiment } from '../../models/Experiment';
import Modal from '../../components/foundation/Modal';
import {
    selectResponses,
    selectSubscriptions,
    selectSubscriptionSequenceByBoxId, shouldContinueRemindersForAccount,
    subScribeToBox,
    unSubscribeFromBox,
} from '../../slices/account';
import { boot } from '../../slices/globalActions';
import Strings from '../../utils/string_dict';
import { ISubscription } from '../../models/Account';
import { IonLabel, IonTabBar, IonTabButton } from '@ionic/react';
import { CalendarBlank, Cube, Gear, ListChecks, Users } from 'phosphor-react';
import BoxesSubMenu from './BoxesSubMenu';

const ExperimentsListScreen = function() {
    const { type } = useParams<{ type: string }>();
    const dispatch = useDispatch();

    const boxExperiments = useSelector((state) => selectExperimentByBoxName(state, type));
    const boxId = useSelector(selectAllBoxes).find(box => box.name === type)!.id;
    const existingSelections = useSelector((state) => selectSubscriptionSequenceByBoxId(state, boxId));
    const subscriptions = useSelector(selectSubscriptions);

    const allExperiments = useSelector(selectAllExperiments);
    const responses = useSelector(selectResponses);

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
        const allExperimentsExcludingSelections  = JSON.parse(JSON.stringify(allExperiments)) as Record<string, GenericExperiment>;
        const allSubscriptionsExcludingSelections  = JSON.parse(JSON.stringify(subscriptions)) as Record<string, ISubscription>;

        Array.from(experimentSelections.values()).flat().forEach(experiment => {
            if ('children' in experiment) {
                experiment.children.forEach((childExperiment) => subscriptions[childExperiment] && subscriptionIds.push(subscriptions[childExperiment].id));
            } else {
                subscriptions[experiment.id] && subscriptionIds.push(subscriptions[experiment.id].id);
            }
            delete allExperimentsExcludingSelections[experiment.id];
            delete allSubscriptionsExcludingSelections[experiment.id];
        });

        const continueRemindersForAccount = shouldContinueRemindersForAccount(allSubscriptionsExcludingSelections, allExperimentsExcludingSelections, responses);
        await unSubscribeFromBox(subscriptionIds, boxId, continueRemindersForAccount);
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
            return <Typography component="span" display="inline" level="body1"> {Strings.confirm_restart_subscription}</Typography>;
        } else {
            return <div>
                <Typography level="h6"> {Strings.confirm_experiment_selection} </Typography>
                <br />
                <br />
                <List>
                    {
                        Array.from(experimentSelections.values()).flat().map((experiment) => {
                            return <ListItem key={experiment.boxWeek + experiment.name}>
                                <ListItemContent>
                                    <Typography>
                                        {Strings.week} {experiment.boxWeek + 1} - {experiment.name}
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
            return Strings.restart_subscription;
        } else {
            return Strings.subscribe_to_box;
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
                    experiments={boxExperiments.filter((item) => !('parent' in item) || !item.parent)}
                    onExperimentSelected={handleExperimentSelected}
                    isCheckBoxSelected={isCheckBoxSelected}
                    isSubscribedToBox={isSubscribedToBox()}
                />
                <br />
            </Stack>

            <br />
            <Button onClick={toggleSubscriptionModal} disabled={experimentSelections.size === 0}> {getConfirmationText()} </Button>

            <Modal
                headerTitle={Strings.confirm_subscription}
                isOpen={subscriptionModalOpen}
                presentingElement={presentingElement}
                onDismiss={toggleSubscriptionModal}
                onAction={onAction}
                children={getModalChildren()}
                className={isSubscribedToBox() ? 'ion-modal-small' : ''}
            />
            <BoxesSubMenu></BoxesSubMenu>
        </Page>
    );
};

export default ExperimentsListScreen;
