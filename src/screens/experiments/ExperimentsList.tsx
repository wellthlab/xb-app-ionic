import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, List, ListItem, ListItemContent, Stack } from '@mui/joy';

import capitalise from './utils/capitalise';

import ExperimentsList from './components/ExperimentsList';

import Page from '../../components/foundation/Page';
import ExerciseWarning from '../../components/ExerciseWarning';

import { useDispatch, useSelector } from '../../slices/store';
import { selectExperimentByBoxName } from '../../slices/experiments';
import { GenericExperiment } from '../../models/Experiment';
import Modal from '../../components/foundation/Modal';

const ExperimentsListScreen = function () {
    const { type } = useParams<{ type: string }>();

    const experiments = useSelector((state) => selectExperimentByBoxName(state, type));
    const [subscriptionModalOpen, setSubscriptionModalOpen] = React.useState(false);
    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();
    const [experimentSelections, setExperimentSelections] = React.useState(new Map<number, GenericExperiment[]>());


    const dispatch = useDispatch();
    const handleExperimentSelected = function (experiment: GenericExperiment, isSelected: boolean) {
        const newExperimentSelections = new Map(experimentSelections);
        if(isSelected) {
            if (newExperimentSelections.has(experiment.boxWeek)) {
                if (!newExperimentSelections.get(experiment.boxWeek)!.some(e => e.id === experiment.id)) {
                    newExperimentSelections.get(experiment.boxWeek)!.push(experiment);
                }
            } else {
                newExperimentSelections.set(experiment.boxWeek, [experiment]);
            }
        } else if (newExperimentSelections.has(experiment.boxWeek)) {
            const filterExperiments = newExperimentSelections.get(experiment.boxWeek)!.filter(e => !(e.id === experiment.id ));
            if(filterExperiments.length === 0) {
                newExperimentSelections.delete(experiment.boxWeek);
            } else {
                newExperimentSelections.set(experiment.boxWeek, filterExperiments);
            }
        }
        setExperimentSelections(newExperimentSelections);
    };

    const toggleSubscriptionModal = () => {
        setSubscriptionModalOpen(!subscriptionModalOpen);

    };


    return (
        <Page headerTitle={`${capitalise(type)} experiments`} sx={{ position: 'relative' }} ref={setPresentingElement}>
            <Stack spacing={2}>
                {type === 'move' && <ExerciseWarning />}

                <ExperimentsList
                    experiments={experiments.filter((item) => !('parent' in item) || !item.parent)}
                    onExperimentSelected={handleExperimentSelected}
                />
                <br />
            </Stack>
            <br />
            <Button onClick={toggleSubscriptionModal} disabled={experimentSelections.size === 0} >Subscribe to this box</Button>

            <Modal
                headerTitle="Confirm Subscription"
                isOpen={subscriptionModalOpen}
                presentingElement={presentingElement}
                onDismiss={() => toggleSubscriptionModal()}
                onAction={() => {
                }}
                children={<div> Do you want to subscribe to these selected experiments:
                    <br />
                    <br />
                    <List>
                        {
                            Array.from(experimentSelections.values()).flat().map((experiment) => {
                                    return <ListItem>
                                        <ListItemContent>
                                            Week {experiment.boxWeek} - {experiment.name}
                                        </ListItemContent>
                                    </ListItem>
                            })

                        }
                    </List>
                </div>}
            />

        </Page>
    );
};

export default ExperimentsListScreen;
