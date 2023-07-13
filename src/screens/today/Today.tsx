import React from 'react';
import { Stack, Typography } from '@mui/joy';

import EntryIcon from './EntryIcon';
import CollapsibleInstructions from './CollapsibleInstructions';

import TasksList from '../../components/TasksList';
import TaskModal from '../../components/TaskModal';
import Centre from '../../components/foundation/Centre';
import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';

import { useSelector } from '../../slices/store';
import { selectTodaysTasks } from '../../slices/experiments';

const Today = function () {
    const tasksByExperiment = useSelector(selectTodaysTasks);

    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();
    const [modalOpen, setModalOpen] = React.useState(false);

    const [experimentId, setExperimentId] = React.useState<string>();
    const [dayId, setDayId] = React.useState<number>();
    const [taskId, setTaskId] = React.useState(0);

    if (!tasksByExperiment.length) {
        return (
            <Page>
                <Centre>
                    <Stack spacing={1}>
                        <Typography level="h6" component="p">
                            You haven't got any task today
                        </Typography>

                        <Typography level="body2" textAlign="center">
                            Explore what you can do in "Boxes"
                        </Typography>
                    </Stack>
                </Centre>
            </Page>
        );
    }

    const handleDismissModal = function () {
        setModalOpen(false);
    };

    const handleClickTask = function (experimentId: string, dayId: number, taskId: number) {
        setModalOpen(true);
        setExperimentId(experimentId);
        setDayId(dayId);
        setTaskId(taskId);
    };

    return (
        <Page ref={setPresentingElement}>
            <PageTitle>Today's Experiments</PageTitle>

            <Stack spacing={4}>
                {tasksByExperiment.map((entry) => (
                    <Stack spacing={2} key={entry.id}>
                        <Stack spacing={2} direction="row" alignItems="center">
                            <EntryIcon experimentId={entry.id} dayId={entry.day} />

                            <div>
                                <Typography level="h4">{entry.name}</Typography>
                                <Typography level="body2">Day {entry.day + 1}</Typography>
                            </div>
                        </Stack>

                        {entry.instructions && <CollapsibleInstructions instructions={entry.instructions} />}

                        <TasksList
                            tasks={entry.content.tasks}
                            dayId={entry.day}
                            experimentId={entry.id}
                            onTaskClick={handleClickTask}
                        />
                    </Stack>
                ))}
            </Stack>

            <TaskModal
                isOpen={modalOpen}
                onDismiss={handleDismissModal}
                key={`${dayId}.${taskId}`}
                experimentId={experimentId || tasksByExperiment[0].id}
                dayId={dayId || tasksByExperiment[0].day}
                taskId={taskId}
                presentingElement={presentingElement}
            />
        </Page>
    );
};

export default Today;
