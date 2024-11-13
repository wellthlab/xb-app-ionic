import React, { MouseEvent } from 'react';
import { Box, Typography } from '@mui/joy';
import { Check, CaretRight, PlusCircle, MinusCircle } from 'phosphor-react';
import { Fab } from '@mui/material';

import List from './foundation/List';
import ListItem from './foundation/ListItem';

import { ITask } from '../models/Experiment';
import getIcon from '../utils/getIcon';
import { useSelector } from '../slices/store';
import { selectCurrentDay, selectProgressByDayNumAndTasks } from '../slices/experiments';
import Strings from '../utils/string_dict';

interface ITasksListProps {
    tasks: ITask[];
    experimentId: string;
    dayNum: number;
    type: string;
    onTaskClick: (experimentId: string, dayNum: number, taskNum: number, type: string) => void;
}

const TasksList = function ({ tasks, experimentId, dayNum, type, onTaskClick }: ITasksListProps) {
    const responseCountByDayNumAndTaskIds: number[] = useSelector((state) => selectProgressByDayNumAndTasks(state, tasks, dayNum));
    const currentDay = useSelector((state) => selectCurrentDay(state, experimentId));

    const tasksGroupedById = new Map();
    tasks.forEach((task, index) => {
        if (task.type === type || type === 'prep') {
            const allTaskOccurrences = [];
            const numTaskOccurrences = Math.max(1, responseCountByDayNumAndTaskIds[index]);
            for (let i = 0; i < numTaskOccurrences; i++) {
                allTaskOccurrences.push(task);
            }
            tasksGroupedById.set(task.taskId, allTaskOccurrences);
        }
    })
    const [groupedTasks, setGroupedTasks] = React.useState(tasksGroupedById);

    const createHandleClickTask = function (taskNum: number) {
        return () => {
            onTaskClick(experimentId, dayNum, taskNum, type);
        };
    };

    const pushTask = (task: ITask) => {
        const newTasksGroupedById =  new Map(groupedTasks);
        newTasksGroupedById.get(task.taskId)?.push(task);
        setGroupedTasks(newTasksGroupedById);
    }

    const popTask = (task: ITask) => {
        const newTasksGroupedById =  new Map(groupedTasks);
        newTasksGroupedById.get(task.taskId)?.pop();
        setGroupedTasks(newTasksGroupedById);
    }

    const isRepeatableTask = (task: ITask) => {
        return task.isRepeatable;
    }

    const isLastCompletedRepeatableTask = (task: ITask, taskCount: number, taskNum: number) => {
        return isRepeatableTask(task) && taskCount ===  responseCountByDayNumAndTaskIds[taskNum];
    }

    const isUncompletedRepeatableTask = (task: ITask, taskCount: number, taskNum: number) => {
        return isRepeatableTask(task) && responseCountByDayNumAndTaskIds[taskNum] > 0 && taskCount >  responseCountByDayNumAndTaskIds[taskNum];
    }

    const addAnotherSubmissionDisabled = (task: ITask, taskNum: number) => {
        return currentDay > dayNum || groupedTasks.get(task.taskId)!.length > Math.max(1, responseCountByDayNumAndTaskIds[taskNum]);
    }

    const onClickAmendTasksButton =  (event: MouseEvent, action: string, task: ITask) => {
        event.stopPropagation();
        if (action === "remove") {
            popTask(task);
        } else if  (action === "add") {
            pushTask(task);
        }
    }

    const getEndDecorator = (task: ITask, taskCount: number, taskCompleted: boolean, taskNum: number ) => {
        if (isLastCompletedRepeatableTask(task, taskCount, taskNum)) {
            return <Fab variant="extended" size="small" aria-label="add" disabled={addAnotherSubmissionDisabled(task, taskNum)} onClick={(event: MouseEvent) => {
                onClickAmendTasksButton(event, "add", task);
            }}>
                <PlusCircle/>
            </Fab>
        } else if (isUncompletedRepeatableTask(task, taskCount, taskNum)) {
            return  <Fab variant="extended" size="small" aria-label="add"  onClick={(event: MouseEvent) => {
                onClickAmendTasksButton(event, "remove", task);
            }}>
                <MinusCircle/>
            </Fab>
        } else if (!taskCompleted) {
            return <CaretRight />;
        } else {
            return null;
        }
    }


    return (
        <List>
            {Array.from(groupedTasks).flatMap(([_, taskList]) => taskList).map((task, index) => {
                const taskIndex = tasks.findIndex(thatTask => task.taskId === thatTask.taskId)!;
                const taskCount= (index-taskIndex) + 1;
                const taskCompleted = responseCountByDayNumAndTaskIds[taskIndex] >= Math.max(1,taskCount);
                const Icon = taskCompleted ? Check : task.icon ? getIcon(task.icon) : undefined;

                return (
                    <div key={taskIndex}>
                        <ListItem
                            button={!taskCompleted}
                            key={taskIndex}
                            startDecorator={
                                Icon &&
                                (taskCompleted ? <Box component={Icon} sx={{ color: 'success.plainColor' }} /> : <Icon />)
                            }
                            endDecorator={getEndDecorator(task, taskCount, taskCompleted, taskIndex)}
                            onClick={createHandleClickTask(taskIndex)}
                        >
                            <Typography sx = {{fontSize: '0.75rem', ml: -1.5}} >
                                {task.isRepeatable ? task.name + `  (${taskCount} ${Strings.of} ${task.minOccurences}) ` : task.name}
                            </Typography>
                        </ListItem>
                    </div>

                );
            })}
        </List>
    );
};

export default TasksList;
