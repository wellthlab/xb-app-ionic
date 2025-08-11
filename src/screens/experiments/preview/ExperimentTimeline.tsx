import React from 'react';
import { Box, Stack } from '@mui/joy';
import TaskModal from './TaskModal';
import TasksList from './TasksList';
import { IExperiment } from '../../../models/Experiment';

const asset_dir = '/assets/experiments/';

interface IExperimentTimelineProps {
    experiment: IExperiment;
    currentDay: number;
}

const ExperimentTimeline = function ({ experiment, currentDay }: IExperimentTimelineProps) {
    const isSubscribedToExperiment = false;

    const [taskModalOpen, setTaskModalOpen] = React.useState(false);
    const [dayNum, setDayNum] = React.useState(0);
    const [taskNum, setTaskNum] = React.useState(0);

    const [reflectionModalOpen, setReflectionModalOpen] = React.useState(false);
    const [reflectionDayNum, setReflectionDayNum] = React.useState<number>(0);
    const [reflectionTaskNum, setReflectionTaskNum] = React.useState(0);

    const handleDismissModal = function (type: string) {
        if (type === 'normal') {
            setTaskModalOpen(false);
        } else if (type === 'reflection') {
            setReflectionModalOpen(false);
        }
    };

    const handleClickTask = function (experimentId: string, dayNum: number, taskNum: number, type: string) {
        console.log(type);
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

    if (!experiment.days.length || !experiment.days[currentDay].tasks.length) {
        return <div>(add at least a task for something to show up here)</div>;
    }

    const reflectionTasks = experiment.days[currentDay].tasks.filter((task) => task.type === 'reflection');
    const normalTasks = experiment.days[currentDay].tasks.filter((task) => task.type === 'normal');

    return (
        <div>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <Stack spacing={2}>
                    <TasksList
                        tasks={experiment.days[currentDay].tasks}
                        experimentId={experiment.id}
                        dayNum={currentDay}
                        type={'normal'}
                        onTaskClick={handleClickTask}
                        currentDay={currentDay}
                    />
                    <TasksList
                        tasks={experiment.days[currentDay].tasks}
                        experimentId={experiment.id}
                        dayNum={currentDay}
                        type={'reflection'}
                        onTaskClick={handleClickTask}
                        currentDay={currentDay}
                    />
                </Stack>
            </Box>

            {normalTasks.length !== 0 && (
                <TaskModal
                    isOpen={taskModalOpen}
                    onDismiss={() => handleDismissModal('normal')}
                    experiment={experiment}
                    dayNum={dayNum}
                    taskNum={taskNum}
                    isSubscribed={isSubscribedToExperiment}
                />
            )}

            {reflectionTasks.length !== 0 && (
                <TaskModal
                    isOpen={reflectionModalOpen}
                    onDismiss={() => handleDismissModal('reflection')}
                    experiment={experiment}
                    dayNum={reflectionDayNum}
                    taskNum={reflectionTaskNum}
                    isSubscribed={isSubscribedToExperiment}
                />
            )}
        </div>
    );
};

export default ExperimentTimeline;
