import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Card, LinearProgress, Link, Stack, Typography } from '@mui/joy';

import capitalise from './utils/capitalise';

import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';

import { useDispatch, useSelector } from '../../slices/store';
import { selectCompletionByExperimentId, selectExperimentByBox } from '../../slices/experiments';
import { subscribeToExperiment } from '../../slices/account';
import { IExperiment } from '../../models/Experiment';

const ExperimentsList = function () {
    const { type } = useParams<{ type: string }>();

    const experiments = useSelector((state) => selectExperimentByBox(state, type));
    const completionByExperimentId = useSelector((state) => selectCompletionByExperimentId(state));

    const history = useHistory();
    const dispatch = useDispatch();
    const createHandleClickExperiment = function (experiment: IExperiment) {
        return async () => {
            await dispatch(subscribeToExperiment(experiment));
            history.push(`/main/box/${type}/${experiment.id}`);
        };
    };

    return (
        <Page headerTitle={`${capitalise(type)} experiments`} sx={{ position: 'relative' }}>
            <PageTitle>Pick an experiment</PageTitle>

            <Stack spacing={2}>
                {experiments.map((experiment) => {
                    const completion = completionByExperimentId[experiment.id];

                    return (
                        <Card
                            key={experiment.id}
                            variant="outlined"
                            sx={{
                                '&:hover, &:focus-within': { bgcolor: 'background.level2' },
                            }}
                        >
                            <Stack spacing={1}>
                                <Link
                                    overlay
                                    textColor="inherit"
                                    underline="none"
                                    onClick={createHandleClickExperiment(experiment)}
                                >
                                    {experiment.name}
                                </Link>
                                <Typography level="body2">{experiment.desc}</Typography>
                                {completion !== undefined ? (
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Typography level="body3">{completion}% completed</Typography>
                                        <LinearProgress determinate value={completion} />
                                    </Stack>
                                ) : (
                                    <Typography level="body3">{experiment.duration} days</Typography>
                                )}
                            </Stack>
                        </Card>
                    );
                })}
            </Stack>
        </Page>
    );
};

export default ExperimentsList;
