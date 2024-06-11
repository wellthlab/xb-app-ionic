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
    selectSubscriptions,
} from '../../slices/account';
import BoxesSubMenu from './BoxesSubMenu';

const ExperimentsListScreen = function() {
    const { type } = useParams<{ type: string }>();

    const boxExperiments = useSelector((state) => selectExperimentByBoxName(state, type));
    const subscriptions = useSelector(selectSubscriptions);
    const completionByExperimentId = useSelector(selectCompletionForAllExperiments);

    const experimentsGroupedByCategory = () => {
      const experiments =  boxExperiments.filter((item) => !('parent' in item) || !item.parent);
      const result = new Map();
      Object.keys(ExperimentCategory).forEach((key) => {
          result.set(key, []);
      });

      experiments.reduce((map, experiment) => {
          if (subscriptions[experiment.id]) {
              if (isExperimentComplete(experiment)) {
                  result.get(ExperimentCategory.COMPLETED.valueOf()).push(experiment);
              } else {
                  result.get(ExperimentCategory.ACTIVE.valueOf()).push(experiment);
              }
          } else if (isExperimentAvailable(experiment)) {
              if (isExperimentSuggested(experiment)) {
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
        return completionByExperimentId[experiment.id] === 100;
    }

    const isExperimentAvailable = (experiment: GenericExperiment) => {
        return !experiment.hidden;
    }

    const isExperimentSuggested = (experiment: GenericExperiment) => {
        return false;
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
