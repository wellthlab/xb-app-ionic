import React from 'react';
import { useParams } from 'react-router-dom';
import { Stack } from '@mui/joy';

import capitalise from './utils/capitalise';

import ExperimentsList from './components/ExperimentsList';

import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';
import ExerciseWarning from '../../components/ExerciseWarning';

import { useDispatch, useSelector } from '../../slices/store';
import { selectExperimentByBoxName } from '../../slices/experiments';
import { subscribeToExperiment, subscribeToParentExperiment } from '../../slices/account';
import { GenericExperiment } from '../../models/Experiment';

const ExperimentsListScreen = function () {
    const { type } = useParams<{ type: string }>();

    const experiments = useSelector((state) => selectExperimentByBoxName(state, type));

    const dispatch = useDispatch();
    const handleClickExperiment = function (experiment: GenericExperiment) {
        if ('children' in experiment) {
            return dispatch(subscribeToParentExperiment({ experiment, resubscribe: false }));
        }

        return dispatch(subscribeToExperiment({ experiment, resubscribe: false }));
    };

    return (
        <Page headerTitle={`${capitalise(type)} experiments`} sx={{ position: 'relative' }}>
            <PageTitle>Pick an experiment</PageTitle>

            <Stack spacing={2}>
                {type === 'move' && <ExerciseWarning />}

                <ExperimentsList
                    experiments={experiments.filter((item) => !('parent' in item) || !item.parent)}
                    onExperimentClick={handleClickExperiment}
                />
            </Stack>
        </Page>
    );
};

export default ExperimentsListScreen;
