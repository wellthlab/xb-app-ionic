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
import { Lock, LockOpen, Check } from 'phosphor-react';

import TaskModal from '../../components/TaskModal';
import TasksList from '../../components/TasksList';
import Page from '../../components/foundation/Page';

import { useSelector } from '../../slices/store';
import { selectExperimentById, selectCurrentDay, selectDayProgress } from '../../slices/experiments';
import { selectSubscriptionByExperimentId } from '../../slices/account';
import { IExperiment } from '../../models/Experiment';

const ExperimentTimeline = function () {
    const { experimentId } = useParams<{ experimentId: string }>();

    const experiment = useSelector((state) => selectExperimentById(state, experimentId)) as IExperiment; // This page will only be shown on children experiment, so we can safely cast here
    const currentDay = useSelector((state) => selectCurrentDay(state, experimentId));
    const dayProgress = useSelector((state) => selectDayProgress(state, experimentId));
    const isSubscribedToExperiment = useSelector(state => {
       return selectSubscriptionByExperimentId(state, experimentId) !== undefined;
    });

    const [modalOpen, setModalOpen] = React.useState(false);
    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();
    const [dayNum, setDayNum] = React.useState(0);
    const [taskNum, setTaskNum] = React.useState(0);

    const handleClickTask = function (_: string, dayNum: number, taskNum: number) {
        setModalOpen(true);
        setDayNum(dayNum);
        setTaskNum(taskNum);
    };

    const handleDismissModal = function () {
        setModalOpen(false);
    };

    const experimentCompleted = dayProgress.reduce((acc, curr) => acc && curr, true);

    return (
        <Page sx={{ height: '100%' }} headerTitle={experiment.name} ref={setPresentingElement}>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                {experiment.instructions &&
                    experiment.instructions.map((p, i) => (
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
                                            bgcolor: !unlocked
                                                ? 'neutral.solidBg'
                                                : dayCompleted
                                                ? 'success.solidBg'
                                                : 'primary.solidBg',
                                        }}
                                    >
                                        {!unlocked ? <Lock /> : dayCompleted ? <Check /> : <LockOpen />}
                                    </TimelineDot>
                                    {dayId !== experiment.days.length - 1 && <TimelineConnector />}
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Typography level="body2" sx={{ my: 2 }}>
                                        Day {dayId + 1}
                                    </Typography>
                                    <Stack spacing={2}>
                                        {unlocked &&
                                            (day.tasks.length ? (
                                                <TasksList
                                                    tasks={day.tasks}
                                                    experimentId={experimentId}
                                                    dayNum={dayId}
                                                    onTaskClick={handleClickTask}
                                                />
                                            ) : (
                                                <Typography level="body2">
                                                    There is nothing to do for this day
                                                </Typography>
                                            ))}
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
                </Stack>
            )}

            <TaskModal
                isOpen={modalOpen}
                onDismiss={handleDismissModal}
                key={`${dayNum}.${taskNum}`}
                experimentId={experimentId}
                dayNum={dayNum}
                taskNum={taskNum}
                presentingElement={presentingElement}
                isSubscribed={isSubscribedToExperiment}
            />
        </Page>
    );
};

export default ExperimentTimeline;
