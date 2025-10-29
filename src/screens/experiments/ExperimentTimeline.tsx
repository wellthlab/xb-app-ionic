import React from 'react';
import { Box, Stack } from '@mui/joy';

import TaskModal from '../../components/TaskModal';
import TasksList from '../../components/TasksList';

import { useSelector } from '../../slices/store';
import { selectExperimentById } from '../../slices/experiments';
import { IExperiment } from '../../models/Experiment';

interface IExperimentTimelineProps {
    experimentId: string;
}

const ExperimentTimeline = function ({ experimentId }: IExperimentTimelineProps) {
    const experiment = useSelector((state) => selectExperimentById(state, experimentId)) as IExperiment; // This page will only be shown on children experiment, so we can safely cast here

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

    const currentDay = 0;

    const reflectionTasks = experiment.days[0].tasks.filter((task) => task.type === 'reflection');

    return (
        <div>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <Stack spacing={2}>
                    <TasksList
                        tasks={experiment.days[currentDay].tasks}
                        experimentId={experimentId}
                        dayNum={currentDay}
                        type={'normal'}
                        onTaskClick={handleClickTask}
                    />
                    <TasksList
                        tasks={experiment.days[currentDay].tasks}
                        experimentId={experimentId}
                        dayNum={currentDay}
                        type={'reflection'}
                        onTaskClick={handleClickTask}
                    />
                </Stack>
            </Box>

            <TaskModal
                isOpen={taskModalOpen}
                onDismiss={() => handleDismissModal('normal')}
                key={`${experimentId}.${dayNum}.${taskNum}.normal`}
                experimentId={experimentId}
                dayNum={dayNum}
                taskNum={taskNum}
            />

            {reflectionTasks.length !== 0 && (
                <TaskModal
                    isOpen={reflectionModalOpen}
                    onDismiss={() => handleDismissModal('reflection')}
                    key={`${experimentId}.${reflectionDayNum}.${reflectionTaskNum}.reflect`}
                    experimentId={experimentId}
                    dayNum={reflectionDayNum}
                    taskNum={reflectionTaskNum}
                />
            )}
        </div>
    );
};

export default ExperimentTimeline;
