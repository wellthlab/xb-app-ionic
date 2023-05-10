import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Stack, Alert, Button } from '@mui/joy';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineDot,
    TimelineConnector,
    TimelineContent,
    timelineItemClasses,
} from '@mui/lab';
import { CaretRight, Lock, LockOpen, Check } from 'phosphor-react';

import TaskModal from './TaskModal';
import getIcon from '../utils/getIcon';

import Page from '../../../components/foundation/Page';
import List from '../../../components/foundation/List';
import ListItem from '../../../components/foundation/ListItem';

import { useSelector, useDispatch } from '../../../slices/store';
import { selectExperiment, selectCurrentDay, selectDayProgress } from '../../../slices/experiments';
import { selectProgress, subscribeToExperiment } from '../../../slices/account';

const ExperimentContent = function () {
    const { experimentId } = useParams<{ experimentId: string }>();

    const experiment = useSelector((state) => selectExperiment(state, experimentId));
    const currentDay = useSelector((state) => selectCurrentDay(state, experimentId));
    const progress = useSelector((state) => selectProgress(state, experimentId));
    const dayProgress = useSelector((state) => selectDayProgress(state, experimentId));

    const [modalOpen, setModalOpen] = React.useState(false);
    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();
    const [taskLocation, setTaskLocation] = React.useState<[number, number]>([0, 0]);

    const createHandleClickTask = function (dayId: number, taskId: number) {
        return () => {
            setModalOpen(true);
            setTaskLocation([dayId, taskId]);
        };
    };

    const handleDismissModal = function () {
        setModalOpen(false);
    };

    const dispatch = useDispatch();
    const handleRedoExperiment = function () {
        dispatch(subscribeToExperiment({ experiment, resubscribe: true }));
    };

    const experimentCompleted = dayProgress.reduce((acc, curr) => acc && curr, true);

    return (
        <Page sx={{ height: '100%' }} headerTitle={experiment.name} ref={setPresentingElement}>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                {experiment.longDesc &&
                    experiment.longDesc.map((p, i) => (
                        <Typography key={i} sx={{ mt: 2 }}>
                            {p}
                        </Typography>
                    ))}

                <Timeline
                    sx={{
                        padding: 0,
                        [`& .${timelineItemClasses.root}:before`]: {
                            flex: 0,
                            padding: 0,
                        },
                    }}
                >
                    {experiment.days.map((day, dayId) => {
                        const unlocked = dayId <= currentDay;
                        const dayCompleted = dayProgress[dayId];

                        return (
                            <TimelineItem key={dayId}>
                                <TimelineSeparator>
                                    <TimelineDot
                                        sx={{
                                            bgcolor: dayCompleted
                                                ? 'success.plainColor'
                                                : unlocked
                                                ? 'primary.plainColor'
                                                : 'grey.400',
                                        }}
                                    >
                                        {dayCompleted ? <Check /> : unlocked ? <LockOpen /> : <Lock />}
                                    </TimelineDot>
                                    {dayId !== experiment.days.length - 1 && <TimelineConnector />}
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Typography level="body2" sx={{ my: 2 }}>
                                        Day {dayId + 1}
                                    </Typography>
                                    <Stack spacing={2}>
                                        {unlocked && day.desc && <Typography>{day.desc}</Typography>}
                                        {unlocked && (
                                            <List sx={{ mb: 2 }}>
                                                {day.tasks.map((task, taskId) => {
                                                    const taskCompleted = progress[dayId]?.[taskId];
                                                    const Icon = taskCompleted
                                                        ? Check
                                                        : task.icon
                                                        ? getIcon(task.icon)
                                                        : undefined;

                                                    return (
                                                        <ListItem
                                                            button={!taskCompleted}
                                                            key={taskId}
                                                            startDecorator={
                                                                Icon &&
                                                                (taskCompleted ? (
                                                                    <Box
                                                                        component={Icon}
                                                                        sx={{ color: 'success.outlinedColor' }}
                                                                    />
                                                                ) : (
                                                                    <Icon />
                                                                ))
                                                            }
                                                            endDecorator={!taskCompleted && <CaretRight />}
                                                            onClick={createHandleClickTask(dayId, taskId)}
                                                        >
                                                            {task.name}
                                                        </ListItem>
                                                    );
                                                })}
                                            </List>
                                        )}
                                    </Stack>
                                </TimelineContent>
                            </TimelineItem>
                        );
                    })}
                </Timeline>
            </Box>

            {experimentCompleted && (
                <Stack spacing={2}>
                    <Alert color="success">Congratulations! You have completed this experiment.</Alert>
                    <Button onClick={handleRedoExperiment}>Redo experiment</Button>
                </Stack>
            )}

            <TaskModal
                isOpen={modalOpen}
                onDismiss={handleDismissModal}
                key={taskLocation.join('.')}
                taskLocation={taskLocation}
                presentingElement={presentingElement}
            />
        </Page>
    );
};

export default ExperimentContent;
