import Strings from '../../utils/string_dict.js';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Stack, Alert, Button, List, ListItem, ListItemContent } from '@mui/joy';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineDot,
    TimelineConnector,
    TimelineContent,
    timelineItemClasses,
} from '@mui/lab';

import { Check, ArrowArcRight, DotsThree } from 'phosphor-react';

import TaskModal from '../../components/TaskModal';
import TasksList from '../../components/TasksList';
import Page from '../../components/foundation/Page';

import { useDispatch, useSelector } from '../../slices/store';
import { selectExperimentById, selectDayProgress } from '../../slices/experiments';
import { selectSubscriptionByExperimentId, subscribeToExperiments } from '../../slices/account';
import { IExperiment } from '../../models/Experiment';
import BoxesSubMenu from './BoxesSubMenu';
import Modal from '../../components/foundation/Modal';
import capitalise from './utils/capitalise';

const ExperimentTimeline = function () {
    const { experimentId } = useParams<{ experimentId: string }>();
    const { type } = useParams<{ type: string }>();


    const experiment = useSelector((state) => selectExperimentById(state, experimentId)) as IExperiment; // This page will only be shown on children experiment, so we can safely cast here
    const dayProgress = useSelector((state) => selectDayProgress(state, experimentId));
    const isSubscribedToExperiment = useSelector(state => {
       return selectSubscriptionByExperimentId(state, experimentId) !== undefined;
    });

    const [taskModalOpen, setTaskModalOpen] = React.useState(false);
    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();
    const [dayNum, setDayNum] = React.useState(0);
    const [taskNum, setTaskNum] = React.useState(0);
    const [subscriptionModalOpen, setSubscriptionModalOpen] = React.useState(false);
    const dispatch = useDispatch();

    const toggleSubscriptionModal = () => {
        setSubscriptionModalOpen(!subscriptionModalOpen);
    };

    const handleSubscribeToExperiment = async () => {
        await dispatch(subscribeToExperiments([experiment]));
        toggleSubscriptionModal();
    };

    const handleClickTask = function (_: string, dayNum: number, taskNum: number) {
        setTaskModalOpen(true);
        setDayNum(dayNum);
        setTaskNum(taskNum);
    };

    const handleDismissTaskModal = function () {
        setTaskModalOpen(false);
    };

    const getModalChildren = () => {
        return <div>
            <Typography level="h6"> {Strings.confirm_experiment_subscription} </Typography>
            <br />
            <List >
                <ListItem key={experiment.name} >
                    <ListItemContent>
                        <Typography style={{ fontStyle: 'italic' }}>
                            {Strings.experiment_type}  - {capitalise(type)}
                        </Typography>
                    </ListItemContent>
                </ListItem>
                <ListItem key={experiment.days.length}>
                    <ListItemContent>
                        <Typography style={{ fontStyle: 'italic' }} >
                            {Strings.experiment_duration}  - {experiment.days.length + " " + Strings.days}
                        </Typography>
                    </ListItemContent>
                </ListItem>
            </List>
        </div>
    };

    const experimentCompleted = dayProgress.reduce((acc, curr) => acc && curr, true);

    return (
        <Page sx={{ height: '100%' }} footerComponent={BoxesSubMenu()} headerTitle={experiment.name} ref={setPresentingElement}>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                {experiment.instructions &&
                    experiment.instructions.map((p, i) => (
                        <Typography key={i} sx={{ mt: 2 }}>
                            {p}
                        </Typography>
                    ))}

                <br/>
                {!('parent' in experiment) &&  <Button onClick={toggleSubscriptionModal} disabled={isSubscribedToExperiment} style={{left: "25%", width: "50%"}}> {Strings.subscribe_to_experiment} </Button>}
                <br/>

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
                        const dayCompleted = dayProgress[dayId];

                        return (
                            <TimelineItem key={dayId}>
                                <TimelineSeparator>
                                    <TimelineDot
                                        sx={{
                                            bgcolor: dayCompleted
                                                ? 'success.solidBg'
                                                : 'grey.solidBg',
                                        }}
                                    >
                                        { dayCompleted ? <Check /> : <ArrowArcRight />}
                                    </TimelineDot>
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Typography level="body2" sx={{ my: 2 }}>
                                        {Strings.day} {dayId + 1}
                                    </Typography>
                                    <Stack spacing={2}>
                                        {day.tasks.length ? (
                                                <TasksList
                                                    tasks={day.tasks}
                                                    experimentId={experimentId}
                                                    dayNum={dayId}
                                                    onTaskClick={handleClickTask}
                                                />
                                            ) : (
                                                <Typography level="body2">
                                                    {Strings.there_is_nothing_to_do_for}
                                                </Typography>
                                            )}
                                    </Stack>
                                </TimelineContent>
                            </TimelineItem>
                        );
                    })}

                    <TimelineItem key={"next"}>
                        <TimelineSeparator>
                            <TimelineDot sx={{
                                            bgcolor: !experimentCompleted
                                                ? 'neutral.solidBg'
                                                : 'success.solidBg'
                                        }}>
                                {<DotsThree />}
                            </TimelineDot>
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography level="body2" sx={{ my: 2 }}>
                                What's Next?
                            </Typography>
                            {experimentCompleted && (
                                <Stack spacing={2}>
                                    "bim"
                                </Stack>
                            )}
                        </TimelineContent>
                    </TimelineItem>
                </Timeline>
            </Box>

            {experimentCompleted && (
                <Stack spacing={2}>
                    <Alert color="success">{Strings.congratulations_you_have}</Alert>
                </Stack>
            )}

            <TaskModal
                isOpen={taskModalOpen}
                onDismiss={handleDismissTaskModal}
                key={`${dayNum}.${taskNum}`}
                experimentId={experimentId}
                dayNum={dayNum}
                taskNum={taskNum}
                presentingElement={presentingElement}
                isSubscribed={isSubscribedToExperiment}
            />

            <Modal
                headerTitle={Strings.confirm_subscription}
                isOpen={subscriptionModalOpen}
                presentingElement={presentingElement}
                onDismiss={toggleSubscriptionModal}
                className={'ion-modal-small'}
                onAction={handleSubscribeToExperiment}
                children={getModalChildren()}
            />
        </Page>
    );
};

export default ExperimentTimeline;
