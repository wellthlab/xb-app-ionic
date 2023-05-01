import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/joy';
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
import SectionTitle from '../../../components/foundation/SectionTitle';
import ExerciseWarning from '../../../components/ExerciseWarning';

import { useSelector } from '../../../slices/store';
import { selectExperiment, selectCurrentDay, selectDayProgress } from '../../../slices/experiments';
import { selectProgress } from '../../../slices/account';

const BoxContent = function () {
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

    return (
        <Page headerTitle={experiment.name} ref={setPresentingElement}>
            {experiment.containsExercise && <ExerciseWarning />}

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
                                <SectionTitle sx={{ mb: 1 }}>{day.name}</SectionTitle>
                                <Typography level="body2" sx={{ mb: 2 }}>
                                    Day {dayId + 1}
                                </Typography>
                                {unlocked && <Typography sx={{ mb: 2 }}>{day.desc}</Typography>}
                                {unlocked && (
                                    <List sx={{ mb: 4 }}>
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
                            </TimelineContent>
                        </TimelineItem>
                    );
                })}
            </Timeline>

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

export default BoxContent;
