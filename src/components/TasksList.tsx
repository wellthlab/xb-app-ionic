import React from 'react';
import { Box, Stack, Typography } from '@mui/joy';
import { Check, CaretRight } from 'phosphor-react';

import List from './foundation/List';
import ListItem from './foundation/ListItem';

import { ITask } from '../models/Experiment';
import getIcon from '../utils/getIcon';
import { useSelector } from '../slices/store';
import { selectProgressByDayNumAndTasks } from '../slices/experiments';
// import { selectProgress } from '../slices/account';

interface ITasksListProps {
    tasks: ITask[];
    experimentId: string;
    dayNum: number;
    onTaskClick: (experimentId: string, dayNum: number, taskNum: number) => void;
}

const TasksList = function ({ tasks, experimentId, dayNum, onTaskClick }: ITasksListProps) {
    const progress: boolean[] = useSelector((state) => selectProgressByDayNumAndTasks(state, tasks, dayNum));

    const createHandleClickTask = function (taskNum: number) {
        return () => {
            onTaskClick(experimentId, dayNum, taskNum);
        };
    };

    return (
        <List sx={{ mb: 2 }}>
            {tasks.map((task, taskNum) => {
                const taskCompleted = progress[taskNum];
                const Icon = taskCompleted ? Check : task.icon ? getIcon(task.icon) : undefined;

                return (
                    <ListItem
                        button={!taskCompleted}
                        key={taskNum}
                        startDecorator={
                            Icon &&
                            (taskCompleted ? <Box component={Icon} sx={{ color: 'success.plainColor' }} /> : <Icon />)
                        }
                        endDecorator={!taskCompleted && <CaretRight />}
                        onClick={createHandleClickTask(taskNum)}
                    >
                        {task.name}
                    </ListItem>
                );
            })}
        </List>
    );
};

export default TasksList;
