import React from 'react';
import { Stack, Typography } from '@mui/joy';

import EntryIcon from './EntryIcon';

import TaskModal from '../../components/TaskModal';
import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';

import { useSelector } from '../../slices/store';
import { selectTodaysTasks } from '../../slices/experiments';
import TasksList from '../../components/TasksList';

const Today = function () {
    const tasksByExperiment = useSelector(selectTodaysTasks);

    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();
    const [modalOpen, setModalOpen] = React.useState(false);
    const [dayId, setDayId] = React.useState(0);
    const [taskId, setTaskId] = React.useState(0);
    const [experimentId, setExperimentId] = React.useState(tasksByExperiment[0].id);

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
            <PageTitle>Today's tasks</PageTitle>

            <Stack spacing={4}>
                {tasksByExperiment.map((entry) => (
                    <div key={entry.id}>
                        <Stack spacing={2} direction="row" alignItems="center" sx={{ mb: 2 }}>
                            <EntryIcon experimentId={entry.id} dayId={entry.day} />

                            <div>
                                <Typography level="h4">{entry.name}</Typography>
                                <Typography level="body2">Day {entry.day + 1}</Typography>
                            </div>
                        </Stack>

                        <TasksList
                            tasks={entry.content.tasks}
                            dayId={entry.day}
                            experimentId={entry.id}
                            onTaskClick={handleClickTask}
                        />
                    </div>
                ))}
            </Stack>

            <TaskModal
                isOpen={modalOpen}
                onDismiss={handleDismissModal}
                key={`${dayId}.${taskId}`}
                experimentId={experimentId}
                dayId={dayId}
                taskId={taskId}
                presentingElement={presentingElement}
            />
        </Page>
    );
};

export default Today;
