import React, { MouseEvent } from 'react';
import { Box, Typography } from '@mui/joy';
import { Check, CaretRight, PlusCircle, MinusCircle } from 'phosphor-react';
import { Fab } from '@mui/material';

import List from '../../../components/foundation/List';
import ListItem from '../../../components/foundation/ListItem';

import { ITask } from '../../../models/Experiment';
import getIcon from '../../../utils/getIcon';
import Strings from '../../../utils/string_dict';

interface ITasksListProps {
    tasks: ITask[];
    experimentId: string;
    dayNum: number;
    type: string;
    onTaskClick: (experimentId: string, dayNum: number, taskNum: number, type: string) => void;
    isPreviousDayTasks?: boolean;
    currentDay: number;
}

const responseCountByDayNumAndTaskIds: number[] = [];

const TasksList = function ({
    tasks,
    experimentId,
    currentDay,
    dayNum,
    type,
    onTaskClick,
    isPreviousDayTasks,
}: ITasksListProps) {
    const [groupedTasks, setGroupedTasks] = React.useState<Record<string, ITask[]>>({});

    React.useEffect(() => {
        const tasksGroupedById: Record<string, ITask[]> = {};
        tasks.forEach((task) => {
            if (task.type === type || type === 'prep') {
                tasksGroupedById[task.taskId] = [task];
            }
        });

        setGroupedTasks(tasksGroupedById);
    }, [tasks, type]);

    const createHandleClickTask = function (taskNum: number) {
        return () => {
            onTaskClick(experimentId, dayNum, taskNum, type);
        };
    };

    const pushTask = (task: ITask) => {
        const tasks = groupedTasks[task.taskId];
        const newTasks = [...tasks, task];
        setGroupedTasks({
            ...groupedTasks,
            [task.taskId]: newTasks,
        });
    };

    const popTask = (task: ITask) => {
        const tasks = groupedTasks[task.taskId];
        const newTasks = [...tasks];
        newTasks.pop();
        setGroupedTasks({
            ...groupedTasks,
            [task.taskId]: newTasks,
        });
    };

    const isRepeatableTask = (task: ITask) => {
        return task.isRepeatable;
    };

    const isLastCompletedRepeatableTask = (task: ITask, taskCount: number, taskNum: number) => {
        return isRepeatableTask(task) && taskCount === responseCountByDayNumAndTaskIds[taskNum];
    };

    const isUncompletedRepeatableTask = (task: ITask, taskCount: number, taskNum: number) => {
        return (
            isRepeatableTask(task) &&
            responseCountByDayNumAndTaskIds[taskNum] > 0 &&
            taskCount > responseCountByDayNumAndTaskIds[taskNum]
        );
    };

    const addAnotherSubmissionDisabled = (task: ITask, taskNum: number) => {
        return (
            currentDay > dayNum ||
            groupedTasks[task.taskId].length > Math.max(1, responseCountByDayNumAndTaskIds[taskNum])
        );
    };

    const onClickAmendTasksButton = (event: MouseEvent, action: string, task: ITask) => {
        event.stopPropagation();
        if (action === 'remove') {
            popTask(task);
        } else if (action === 'add') {
            pushTask(task);
        }
    };

    const getEndDecorator = (task: ITask, taskCount: number, taskCompleted: boolean, taskNum: number) => {
        if (isLastCompletedRepeatableTask(task, taskCount, taskNum)) {
            return (
                <Fab
                    variant="extended"
                    size="small"
                    aria-label="add"
                    disabled={addAnotherSubmissionDisabled(task, taskNum)}
                    onClick={(event: MouseEvent) => {
                        onClickAmendTasksButton(event, 'add', task);
                    }}
                >
                    <PlusCircle />
                </Fab>
            );
        } else if (isUncompletedRepeatableTask(task, taskCount, taskNum)) {
            return (
                <Fab
                    variant="extended"
                    size="small"
                    aria-label="add"
                    onClick={(event: MouseEvent) => {
                        onClickAmendTasksButton(event, 'remove', task);
                    }}
                >
                    <MinusCircle />
                </Fab>
            );
        } else if (!taskCompleted) {
            return <CaretRight />;
        } else {
            return null;
        }
    };

    return (
        <List variant="plain">
            {Object.entries(groupedTasks)
                .flatMap(([_, taskList]) => taskList)
                .map((task, index) => {
                    const taskGroup = groupedTasks[task.taskId];
                    const taskIndex = tasks.findIndex((thatTask) => task.taskId === thatTask.taskId)!;
                    const taskCompleted =
                        responseCountByDayNumAndTaskIds[taskIndex] >= Math.max(1, index - taskIndex + 1);
                    const Icon = taskCompleted ? Check : task.icon ? getIcon(task.icon) : undefined;

                    return (
                        <div key={taskIndex}>
                            <ListItem
                                button={!taskCompleted}
                                startDecorator={
                                    Icon &&
                                    (taskCompleted ? (
                                        <Box component={Icon} sx={{ color: 'success.plainColor' }} />
                                    ) : (
                                        <Icon />
                                    ))
                                }
                                endDecorator={getEndDecorator(task, taskGroup.length, taskCompleted, taskIndex)}
                                onClick={createHandleClickTask(taskIndex)}
                            >
                                <Typography sx={{ fontSize: '0.75rem', ml: -1.5 }}>
                                    {task.isRepeatable
                                        ? task.name +
                                          `  (${index - taskIndex + 1} ${Strings.of} ${task.minOccurences}) `
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
