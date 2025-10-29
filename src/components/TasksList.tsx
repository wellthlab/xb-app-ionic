import React from 'react';
import { Typography } from '@mui/joy';
import { CaretRight } from 'phosphor-react';

import List from './foundation/List';
import ListItem from './foundation/ListItem';

import { ITask } from '../models/Experiment';
import getIcon from '../utils/getIcon';
import Strings from '../utils/string_dict';

interface ITasksListProps {
    tasks: ITask[];
    experimentId: string;
    dayNum: number;
    type: string;
    onTaskClick: (experimentId: string, dayNum: number, taskNum: number, type: string) => void;
}

const TasksList = function ({ tasks, experimentId, dayNum, type, onTaskClick }: ITasksListProps) {
    const createHandleClickTask = function (taskNum: number) {
        return () => {
            onTaskClick(experimentId, dayNum, taskNum, type);
        };
    };

    return (
        <List variant="plain">
            {tasks.map((task, index) => {
                const taskIndex = tasks.findIndex((thatTask) => task.taskId === thatTask.taskId)!;
                const Icon = task.icon ? getIcon(task.icon) : undefined;

                return (
                    <div key={taskIndex}>
                        <ListItem
                            button
                            key={taskIndex}
                            startDecorator={Icon && <Icon />}
                            endDecorator={<CaretRight />}
                            onClick={createHandleClickTask(taskIndex)}
                        >
                            <Typography sx={{ fontSize: '0.75rem', ml: -1.5 }}>
                                {task.isRepeatable
                                    ? task.name + `  (${index - taskIndex + 1} ${Strings.of} ${task.minOccurences}) `
                                    : task.name}
                            </Typography>
                        </ListItem>
                    </div>
                );
            })}
        </List>
    );
};

export default TasksList;
