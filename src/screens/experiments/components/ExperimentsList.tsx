import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Stack, Card, Typography, Link, LinearProgress } from '@mui/joy';

import { GenericExperiment } from '../../../models/Experiment';
import { useSelector } from '../../../slices/store';
import { selectCompletionForAllExperiments } from '../../../slices/experiments';

interface IExperimentsListProps {
    experiments: GenericExperiment[];
    onExperimentClick?: (experiment: GenericExperiment) => void;
}

const ExperimentsList = function ({ experiments, onExperimentClick }: IExperimentsListProps) {
    const { pathname } = useLocation();

    const completionByExperimentId = useSelector(selectCompletionForAllExperiments);

    const history = useHistory();
    const createHandleExperimentClick = function (experiment: GenericExperiment) {
        return async () => {
            await onExperimentClick?.(experiment);
            history.push(`${pathname}/${experiment.id}`);
        };
    };

    return (
        <Stack spacing={2}>
            {experiments
                .filter((experiment) => !experiment.hidden)
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
                            <Stack spacing={1}>
                                <Link
                                    overlay
                                    textColor="inherit"
                                    underline="none"
                                    onClick={createHandleExperimentClick(experiment)}
                                >
                                    {experiment.name}
                                </Link>
                                {experiment.desc && <Typography level="body2">{experiment.desc}</Typography>}
                                {completion !== undefined ? (
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Typography level="body3">{completion}% completed</Typography>
                                        <LinearProgress determinate value={completion} />
                                    </Stack>
                                ) : (
                                    <Typography level="body3">{experiment.duration} day(s)</Typography>
                                )}
                            </Stack>
                        </Card>
                    );
                })}
        </Stack>
    );
};

export default ExperimentsList;
