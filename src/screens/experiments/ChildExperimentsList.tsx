import React from 'react';
import { useParams } from 'react-router-dom';

import ExperimentTimeline from './ExperimentTimeline';
import ExperimentsList from './components/ExperimentsList';

import Page from '../../components/foundation/Page';

import { useSelector } from '../../slices/store';
import { selectAllExperiments, selectExperimentById } from '../../slices/experiments';
import { ExperimentCategory } from '../../models/Experiment';

const ChildExperimentsList = function () {
    const { experimentId } = useParams<{ experimentId: string }>();

    const experiment = useSelector((state) => selectExperimentById(state, experimentId));
    const experiments = useSelector(selectAllExperiments);

    if (!('children' in experiment)) {
        return <ExperimentTimeline />;
    }

    const children = experiment.children.map((item) => experiments[item]);
    const experimentsGroupedByCategory = new Map();
    experimentsGroupedByCategory.set(ExperimentCategory.SUB_EXPERIMENT.valueOf(), children)

    return (
        <Page headerTitle={experiment.name}>
            <ExperimentsList experimentsGroupedByCategory={experimentsGroupedByCategory}/>
        </Page>
    );
};

export default ChildExperimentsList;
