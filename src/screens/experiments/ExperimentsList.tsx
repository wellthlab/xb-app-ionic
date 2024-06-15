import React from 'react';
import { useParams } from 'react-router-dom';
import { Stack } from '@mui/joy';

import capitalise from './utils/capitalise';
import ExperimentsList from './components/ExperimentsList';
import Page from '../../components/foundation/Page';
import ExerciseWarning from '../../components/ExerciseWarning';

import { useSelector } from '../../slices/store';
import {
    selectCompletionForAllExperiments,
    selectExperimentByBoxName,
} from '../../slices/experiments';
import { ExperimentCategory, GenericExperiment } from '../../models/Experiment';
import {
    selectCohort,
    selectSubscriptions,
} from '../../slices/account';
import BoxesSubMenu from './BoxesSubMenu';

const ExperimentsListScreen = function() {
    const { type } = useParams<{ type: string }>();

    const boxExperiments = useSelector((state) => selectExperimentByBoxName(state, type));
    const subscriptions = useSelector(selectSubscriptions);
    const completionByExperimentId = useSelector(selectCompletionForAllExperiments);
    const cohort = useSelector(selectCohort);
    const experimentsGroupedByCategory = () => {
      const experiments =  boxExperiments.filter((item) => !('parent' in item) || !item.parent);
      const result = new Map();
      Object.keys(ExperimentCategory).filter(key => key != ExperimentCategory.SUB_EXPERIMENT.valueOf()).forEach((key) => {
          result.set(key, []);
      });

      experiments.reduce((map, experiment) => {
          if (iSubscribedToExperiment(experiment)) {
              if (isExperimentComplete(experiment)) {
                  result.get(ExperimentCategory.COMPLETED.valueOf()).push(experiment);
              } else {
                  result.get(ExperimentCategory.ACTIVE.valueOf()).push(experiment);
              }
          } else if (isExperimentAvailable(experiment)) {
              if (isExperimentScheduled(experiment)) {
                  result.get(ExperimentCategory.SCHEDULED.valueOf()).push(experiment);
              } else if (isExperimentSuggested(experiment)) {
                  result.get(ExperimentCategory.SUGGESTED.valueOf()).push(experiment);
              } else {
                  result.get(ExperimentCategory.AVAILABLE.valueOf()).push(experiment);
              }
          }
          return map;
      }, result);
      return result;
    }

    const isExperimentComplete = (experiment: GenericExperiment) => {
        if ('children' in experiment) {
            experiment.children.every(child => completionByExperimentId[child] === 100);
        } else {
            return completionByExperimentId[experiment.id] === 100;
        }
    }

    const isExperimentAvailable = (experiment: GenericExperiment) => {
        return !experiment.hidden;
    }

    const isExperimentSuggested = (experiment: GenericExperiment) => {
        return experiment.isSuggested;
    }

    const isExperimentScheduled = (experiment: GenericExperiment) => {
       return cohort && cohort.experimentSchedule
                        .flatMap(schedule => schedule.experiments)
                        .some(scheduledExperimentId => scheduledExperimentId === experiment.id);

    }

    const iSubscribedToExperiment = (experiment: GenericExperiment) => {
        return Object.keys(subscriptions).includes(experiment.id) || ('children' in experiment && experiment.children.every(child => Object.keys(subscriptions).includes(child)));
    }

    return (
        <Page footerComponent={BoxesSubMenu()} headerTitle={`${capitalise(type)} experiments`} >
            <Stack spacing={2}>
                {type === 'move' && <ExerciseWarning />}
                <ExperimentsList
                    key={type}
                    experimentsGroupedByCategory={experimentsGroupedByCategory()}
                />
                <br />
            </Stack>
        </Page>
    );
};

export default ExperimentsListScreen;
