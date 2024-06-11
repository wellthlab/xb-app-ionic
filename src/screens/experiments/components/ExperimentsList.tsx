import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Card, LinearProgress, Link, Stack, Typography } from '@mui/joy';

import { ExperimentCategory, GenericExperiment } from '../../../models/Experiment';
import { useSelector } from '../../../slices/store';
import { selectCompletionForAllExperiments } from '../../../slices/experiments';
import Strings from '../../../utils/string_dict';

interface IExperimentsListProps {
    experimentsGroupedByCategory: Map<ExperimentCategory, GenericExperiment[]>;
}

const ExperimentsList = function({
                                     experimentsGroupedByCategory,
                                 }: IExperimentsListProps) {
    const completionByExperimentId = useSelector(selectCompletionForAllExperiments);
    const { pathname } = useLocation();
    const history = useHistory();

    const getCategoryTitle = (experimentCategory: ExperimentCategory) => {
        switch (experimentCategory) {
            case ExperimentCategory.ACTIVE:
                return Strings.active_experiments;
            case ExperimentCategory.AVAILABLE:
                return Strings.available_experiments;
            case ExperimentCategory.SUGGESTED:
                return Strings.suggested_experiments;
            case ExperimentCategory.COMPLETED:
                return Strings.completed_experiments;
        }
    };
    return (
        <Stack spacing={5}>
            {Array.from(experimentsGroupedByCategory).map(([experimentCategory, experiments]) => {
                return experiments.length === 0 ?
                    <Stack>
                        <Typography level="h6" sx={{ mb: 2, mt: 2, fontWeight: 'lg', }}>
                            {getCategoryTitle(experimentCategory)}
                        </Typography>
                        <Card key={experimentCategory} variant="outlined">
                            <Typography level="body2" textAlign="center">
                                <br /> {Strings.no_experiments_in_category}<br /><br />
                            </Typography>
                        </Card>
                    </Stack>
                    : <Stack spacing={2}>
                        <Typography level="h5" sx={{ mb: 2, mt: 2, fontWeight: 'lg', }}>
                            {getCategoryTitle(experimentCategory)}
                        </Typography>
                        {experiments
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
                                        {experiment.name}
                                        <Stack spacing={1}>
                                            <Link
                                                overlay
                                                textColor="inherit"
                                                underline="none"
                                                onClick={() => {
                                                    history.push(`${pathname}/${experiment.id}`);
                                                }}
                                            >
                                            </Link>
                                            {experiment.desc &&
                                                <Typography level="body2">
                                                    {experiment.desc}
                                                </Typography>}
                                            {completion !== undefined ? (
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Typography
                                                        level="body3">{completion}{Strings.percent_completed}</Typography>
                                                    <LinearProgress determinate value={completion} />
                                                </Stack>
                                            ) : (
                                                <Typography
                                                    level="body3">{experiment.duration}{Strings.day_s_}</Typography>
                                            )}
                                        </Stack>
                                    </Card>
                                );
                            })}
                    </Stack>;
            })}
        </Stack>
    );
};

export default ExperimentsList;
