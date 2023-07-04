import React from 'react';
import { useParams } from 'react-router-dom';

import ExperimentTimeline from './ExperimentTimeline';
import ExperimentsList from './components/ExperimentsList';

import Page from '../../components/foundation/Page';

import { useSelector } from '../../slices/store';
import { selectAllExperimentsById, selectExperiment } from '../../slices/experiments';

const ChildExperimentsList = function () {
    const { experimentId } = useParams<{ experimentId: string }>();

    const experiment = useSelector((state) => selectExperiment(state, experimentId));
    const experiments = useSelector(selectAllExperimentsById);

    if (!('children' in experiment)) {
        return <ExperimentTimeline />;
    }

    const children = experiment.children.map((item) => experiments[item]);

    return (
        <Page headerTitle={experiment.name}>
            <ExperimentsList experiments={children} />
        </Page>
    );
};

export default ChildExperimentsList;
