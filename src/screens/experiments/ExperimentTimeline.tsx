import Strings from '../../utils/string_dict.js';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import { Box,Stack, Alert} from '@mui/joy';

import TaskModal from '../../components/TaskModal';
import TasksList from '../../components/TasksList';

import { useSelector } from '../../slices/store';
import { selectExperimentById, selectDayProgress, selectCurrentDay } from '../../slices/experiments';
import { selectSubscriptionByExperimentId } from '../../slices/account';
import { IExperiment } from '../../models/Experiment';
import getContent from './utils/getContent';

const asset_dir = '/assets/experiments/';

interface IExperimentTimelineProps {
    experimentId: string;
}

const ExperimentTimeline = function ({ experimentId }: IExperimentTimelineProps) {
    const experiment = useSelector((state) => selectExperimentById(state, experimentId)) as IExperiment; // This page will only be shown on children experiment, so we can safely cast here
    const prepExperiment = useSelector((state) =>
        selectExperimentById(state, experiment.prepExperiment),
    ) as IExperiment;
    const dayProgress = useSelector((state) => selectDayProgress(state, experimentId));
    const subscription = useSelector((state) => {
        return selectSubscriptionByExperimentId(state, experimentId);
    });
    const isSubscribedToExperiment = subscription !== undefined;
    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();

    const [taskModalOpen, setTaskModalOpen] = React.useState(false);
    const [dayNum, setDayNum] = React.useState(0);
    const [taskNum, setTaskNum] = React.useState(0);

    const [reflectionModalOpen, setReflectionModalOpen] = React.useState(false);
    const [reflectionDayNum, setReflectionDayNum] = React.useState<number>(0);
    const [reflectionTaskNum, setReflectionTaskNum] = React.useState(0);

    const theme = useTheme();

    const handleDismissModal = function (type: string) {
        if (type === 'normal') {
            setTaskModalOpen(false);
        } else if (type === 'reflection') {
            setReflectionModalOpen(false);
        }
    };

    const handleClickTask = function (experimentId: string, dayNum: number, taskNum: number, type: string) {
        if (type === 'normal') {
            setTaskModalOpen(true);
            setDayNum(dayNum);
            setTaskNum(taskNum);
        } else if (type === 'reflection') {
            setReflectionModalOpen(true);
            setReflectionDayNum(dayNum);
            setReflectionTaskNum(taskNum);
        }
    };

    const currentDay = Math.min(
        useSelector((state) => selectCurrentDay(state, experimentId)),
        experiment.days.length - 1,
    );
    const [activeDay, setActiveDay] = React.useState(0);

    const handleNext = () => {
        setActiveDay((prevActiveDay) => prevActiveDay + 1);
    };

    const handleBack = () => {
        setActiveDay((prevActiveDay) => prevActiveDay - 1);
    };

    const getExperimentDescription = (experiment: IExperiment) => {
        return (
            <Stack spacing={0.5}>
                {experiment.desc.map((element) => (
                    <div>{getContent(element)}</div>
                ))}
            </Stack>
        );
    };

    const experimentCompleted = dayProgress.reduce((acc, curr) => acc && curr, true);
    const reflectionTasks = experiment.days[0].tasks.filter((task) => task.type === 'reflection');
    const prepExperimentTasks = prepExperiment ? prepExperiment.days[0].tasks : [];

    return (
        <div>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <Stack spacing={2} key={activeDay}>
                    <TasksList
                        tasks={experiment.days[currentDay].tasks}
                        experimentId={experimentId}
                        dayNum={activeDay}
                        type={'normal'}
                        onTaskClick={handleClickTask}
                    />
                    <TasksList
                        tasks={experiment.days[currentDay].tasks}
                        experimentId={experimentId}
                        dayNum={activeDay}
                        type={'reflection'}
                        onTaskClick={handleClickTask}
                    />
                </Stack>
            </Box>

            {experimentCompleted && (
                <Stack spacing={2}>
                    <Alert color="success">{Strings.congratulations_you_have}</Alert>
                </Stack>
            )}

            <TaskModal
                isOpen={taskModalOpen}
                onDismiss={() => handleDismissModal('normal')}
                key={`${experimentId}.${dayNum}.${taskNum}.normal`}
                experimentId={experimentId}
                dayNum={dayNum}
                taskNum={taskNum}
                presentingElement={presentingElement}
                isSubscribed={isSubscribedToExperiment}
            />

            {reflectionTasks.length !== 0 && (
                <TaskModal
                    isOpen={reflectionModalOpen}
                    onDismiss={() => handleDismissModal('reflection')}
                    key={`${experimentId}.${reflectionDayNum}.${reflectionTaskNum}.reflect`}
                    experimentId={experimentId}
                    dayNum={reflectionDayNum}
                    taskNum={reflectionTaskNum}
                    presentingElement={presentingElement}
                    isSubscribed={isSubscribedToExperiment}
                />
            )}
        </div>
    );
};

export default ExperimentTimeline;
