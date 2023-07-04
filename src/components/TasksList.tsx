import React from 'react';
import { Box, Stack, Typography } from '@mui/joy';
import { Check, CaretRight } from 'phosphor-react';

import List from './foundation/List';
import ListItem from './foundation/ListItem';

import { ITask } from '../models/Experiment';
import getIcon from '../utils/getIcon';
import { useSelector } from '../slices/store';
import { selectProgress } from '../slices/account';

interface ITasksListProps {
    tasks: ITask[];
    experimentId: string;
    dayId: number;
    onTaskClick: (experimentId: string, dayId: number, taskId: number) => void;
}

const TasksList = function ({ tasks, experimentId, dayId, onTaskClick }: ITasksListProps) {
    const progress = useSelector((state) => selectProgress(state, experimentId));

    const createHandleClickTask = function (taskId: number) {
        return () => {
            onTaskClick(experimentId, dayId, taskId);
        };
    };

    return (
        <List sx={{ mb: 2 }}>
            {tasks.map((task, taskId) => {
                const taskCompleted = progress[dayId]?.[taskId];
                const Icon = taskCompleted ? Check : task.icon ? getIcon(task.icon) : undefined;

                return (
                    <ListItem
                        button={!taskCompleted}
                        key={taskId}
                        startDecorator={
                            Icon &&
                            (taskCompleted ? <Box component={Icon} sx={{ color: 'success.plainColor' }} /> : <Icon />)
                        }
                        endDecorator={!taskCompleted && <CaretRight />}
                        onClick={createHandleClickTask(taskId)}
                    >
                        {task.name}
                    </ListItem>
                );
            })}
        </List>
    );
};

export default TasksList;
