import Strings from '../../utils/string_dict.js';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/joy';

import EntryIcon from './EntryIcon';
import TasksList from '../../components/TasksList';
import TaskModal from '../../components/TaskModal';
import Centre from '../../components/foundation/Centre';
import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';
import {
    Divider,
    ListDivider,
    List,
    ListItem,
    ListItemContent,
    Card,
} from '@mui/joy';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AddIcon from '@mui/icons-material/Add';

import { useSelector } from '../../slices/store';
import { selectTodaysTasks } from '../../slices/experiments';
import { IExperiment } from '../../models/Experiment';

const Today = function() {
    const tasksByExperiment = useSelector(selectTodaysTasks);

    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();
    const [modalOpen, setModalOpen] = React.useState(false);
    const [experimentId, setExperimentId] = React.useState<string>('');
    const [dayNum, setDayNum] = React.useState<number>(0);
    const [taskNum, setTaskNum] = React.useState(0);


    const [reflectionModalOpen, setReflectionModalOpen] = React.useState(false);
    const [reflectionExperimentId, setReflectionExperimentId] = React.useState<string>('');
    const [reflectionDayNum, setReflectionDayNum] = React.useState<number>(0);
    const [reflectionTaskNum, setReflectionTaskNum] = React.useState(0);

    if (!tasksByExperiment.length) {
        return (
            <Page>
                <Centre>
                    <Stack spacing={1}>
                        <Typography level="h6" component="p">
                            {Strings.you_havent_got_any_task_today}
                        </Typography>

                        <Typography level="body2">
                            {Strings.explore_what_you_can_do_in}
                            <br />
                            <br />
                        </Typography>

                        <Button component={Link} to="/main/box">
                            {Strings.click_here_to_find_some}
                        </Button>
                    </Stack>
                </Centre>
            </Page>
        );
    }

    const handleDismissModal = function(type: string) {
        if (type === 'normal') {
            setModalOpen(false);
        } else {
            setReflectionModalOpen(false);
        }
    };

    const handleClickTask = function(experimentId: string, dayNum: number, taskNum: number, type: string) {
        if (type === 'normal') {
            setModalOpen(true);
            setExperimentId(experimentId);
            setDayNum(dayNum);
            setTaskNum(taskNum);
        } else {
            setReflectionModalOpen(true);
            setReflectionExperimentId(experimentId);
            setReflectionDayNum(dayNum);
            setReflectionTaskNum(taskNum);
        }
    };


    const getReflectionTasks = (experiment: IExperiment) => {
        return experiment.days[0].tasks.filter(task => task.type === 'reflection');
    };
    return (
        <Page ref={setPresentingElement}>
            <PageTitle>{Strings.todays_experiments}</PageTitle>


            <Stack spacing={4}>
                {tasksByExperiment.map((entry) => (
                    <Card>
                        <Stack spacing={2} key={entry.experiment.id}>
                            <Stack spacing={2} direction="row" alignItems="center">
                                <EntryIcon experimentId={entry.experiment.id} dayNum={entry.day} />

                                <div>
                                    <Typography level="h4">{entry.experiment.name}</Typography>
                                    <Typography level="body2">
                                        {Strings.day} {entry.day + 1}
                                    </Typography>
                                </div>
                            </Stack>

                            <Stack spacing={2}>
                                {entry.experiment.steps.length !== 0 && <Accordion variant="outlined">
                                    <AccordionSummary expandIcon={<AddIcon />}
                                    >
                                        <Typography level="h5" sx={{ mb: 2, mt: 2, fontWeight: 'lg' }}>
                                            {Strings.steps}
                                        </Typography>
                                    </AccordionSummary>
                                    <Divider />
                                    <AccordionDetails style={{ backgroundColor: '#eeeeee' }}> <br />
                                        <List sx={{ ml: 2 }}>
                                            {entry.experiment.steps.map(step => {
                                                return <div>
                                                    <ListItem sx={{ display: 'list-item' }}>
                                                        <ListItemContent>
                                                            <Typography>
                                                                {step}
                                                            </Typography>
                                                        </ListItemContent>
                                                    </ListItem>
                                                    <ListDivider />
                                                    <br />
                                                </div>;
                                            })}
                                        </List>
                                    </AccordionDetails>
                                </Accordion>}

                                <Accordion variant="outlined">
                                    <AccordionSummary expandIcon={<AddIcon />}
                                    >
                                        <Typography level="h5" sx={{ mb: 2, mt: 2, fontWeight: 'lg' }}>
                                            {Strings.checks}
                                        </Typography>
                                    </AccordionSummary>
                                    <Divider />
                                    <AccordionDetails style={{ backgroundColor: '#eeeeee' }}>
                                        <Stack spacing={2}>
                                            <TasksList
                                                tasks={entry.experiment.days[entry.day].tasks}
                                                experimentId={entry.experiment.id}
                                                type={'normal'}
                                                dayNum={entry.day}
                                                onTaskClick={handleClickTask}
                                            />
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>

                                {getReflectionTasks(entry.experiment).length !== 0 && <Accordion variant="outlined">
                                    <AccordionSummary expandIcon={<AddIcon />}
                                    >
                                        <Typography level="h5" sx={{ mb: 2, mt: 2, fontWeight: 'lg' }}>
                                            {Strings.reflections}
                                        </Typography>
                                    </AccordionSummary>
                                    <Divider />
                                    <AccordionDetails style={{ backgroundColor: '#eeeeee' }}>
                                        <Stack spacing={2}>
                                            <TasksList
                                                tasks={entry.experiment.days[entry.day].tasks}
                                                experimentId={entry.experiment.id}
                                                dayNum={entry.day}
                                                type={'reflection'}
                                                onTaskClick={handleClickTask}
                                            />
                                        </Stack> </AccordionDetails>
                                </Accordion>}

                                {entry.experiment.tips.length !== 0 && <Accordion variant="outlined">
                                    <AccordionSummary expandIcon={<AddIcon />}
                                    >
                                        <Typography level="h5" sx={{ mb: 2, mt: 2, fontWeight: 'lg' }}>
                                            {Strings.tips}
                                        </Typography>
                                    </AccordionSummary>
                                    <Divider />
                                    <AccordionDetails style={{ backgroundColor: '#eeeeee' }}> <br />
                                        <List sx={{ ml: 2 }}>
                                            {entry.experiment.tips.map(tip => {
                                                return <div>
                                                    <ListItem sx={{ display: 'list-item' }}>
                                                        <ListItemContent>
                                                            <Typography>
                                                                {tip}
                                                            </Typography>
                                                        </ListItemContent>
                                                    </ListItem>
                                                    <ListDivider />
                                                    <br />
                                                </div>;
                                            })}
                                        </List>
                                    </AccordionDetails>
                                </Accordion>}
                            </Stack>
                        </Stack>
                    </Card>
                ))}
            </Stack>


            {experimentId && <TaskModal
                isOpen={modalOpen}
                onDismiss={() => handleDismissModal('normal')}
                key={`${experimentId}.${dayNum}.${taskNum}`}
                experimentId={experimentId}
                dayNum={dayNum}
                taskNum={taskNum}
                presentingElement={presentingElement}
                isSubscribed={true}
            />}

            {reflectionExperimentId && <TaskModal
                isOpen={reflectionModalOpen}
                onDismiss={() => handleDismissModal('reflection')}
                key={`${reflectionExperimentId}.${reflectionDayNum}.${reflectionTaskNum}`}
                experimentId={reflectionExperimentId}
                dayNum={reflectionDayNum}
                taskNum={reflectionTaskNum}
                presentingElement={presentingElement}
                isSubscribed={true}
            />}
        </Page>
    );
};

export default Today;
