import Strings from '../../utils/string_dict.js';
import React from 'react';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
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
import {
    selectAllBoxes,
    selectAllExperiments,
    selectTodaysTasks,
} from '../../slices/experiments';
import experiment, { IExperiment } from '../../models/Experiment';

const Today = function() {
    const location = useLocation();
    const params = useParams<{ box: string }>();
    const isOnLogin = location.pathname.includes('onlogin');
    const isDemo = location.pathname.includes('demo');

    const boxes = useSelector(selectAllBoxes);
    const allExperiments = useSelector(selectAllExperiments);
    let tasksByExperiment = useSelector(selectTodaysTasks);

    // This is a hack so that the tasks for all experiments for a given box can be viewed for demo purposes
    if (isDemo) {
        const demoTasks = Object
            .values(allExperiments)
            .filter(experiment => experiment.boxId === boxes.find(box => box.name === params.box)!.id)
            .sort((e1, e2) => e1.boxweek - e2.boxweek)
            .map(experiment => {
                return {
                    experiment: experiment,
                    day: 0,
                };
            });
        tasksByExperiment = demoTasks;
    }

    const history = useHistory();
    const selectBoxName = (boxId: string) => boxes.find(box => box.id === boxId)!.name;

    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();
    const [modalOpen, setModalOpen] = React.useState(false);
    const [experimentId, setExperimentId] = React.useState<string>('');
    const [dayNum, setDayNum] = React.useState<number>(0);
    const [taskNum, setTaskNum] = React.useState(0);


    const [reflectionModalOpen, setReflectionModalOpen] = React.useState(false);
    const [reflectionExperimentId, setReflectionExperimentId] = React.useState<string>('');
    const [reflectionDayNum, setReflectionDayNum] = React.useState<number>(0);
    const [reflectionTaskNum, setReflectionTaskNum] = React.useState(0);

    if (isOnLogin && !tasksByExperiment.length) {
        history.push("/main/box");
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

    return !tasksByExperiment.length ? (
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
    ) : (
        <Page ref={setPresentingElement}>
            <PageTitle sx={{fontSize: '1.5rem'}}>{Strings.todays_experiments}</PageTitle>

            <Stack spacing={4}>
                {tasksByExperiment.map((entry) => (
                    <Card >
                        <Stack spacing={2}  key={entry.experiment.id}>
                            <Stack spacing={2} direction="row" alignItems="left">
                                <EntryIcon experimentId={entry.experiment.id} dayNum={entry.day} />

                                <div>
                                    <Button sx={{fontSize: '0.8rem'}} color="neutral" size="sm" variant="soft" onClick={() => history.push(`/main/box/${selectBoxName(entry.experiment.boxId)}/${entry.experiment.id}`)}>{entry.experiment.name}</Button>
                                    <Typography level="body2">
                                        {Strings.day} {entry.day + 1}
                                    </Typography>
                                </div>
                            </Stack>

                            <Stack spacing={2}>
                                {entry.experiment.steps.length !== 0 && <Accordion variant="outlined">
                                    <AccordionSummary expandIcon={<AddIcon />}
                                    >
                                        <Typography level="h6" sx={{ mb: 2, mt: 2, fontWeight: 'lg', fontSize: '0.7rem' }}>
                                            {Strings.steps}
                                        </Typography>
                                    </AccordionSummary>
                                    <Divider />
                                    <AccordionDetails style={{ backgroundColor: '#eeeeee' }}  sx={{padding: 0}}> <br />
                                        <List sx={{marginBlockStart: -2}}>
                                            {entry.experiment.steps.map((step, index) => {
                                                return <div>
                                                    <ListItem sx={{ display: 'list-item' }}>
                                                        <ListItemContent >
                                                            <Typography sx={{fontSize: '0.8rem'}}>
                                                                {step}
                                                            </Typography>
                                                        </ListItemContent>
                                                    </ListItem>

                                                    {index !== entry.experiment.steps.length -1 &&
                                                        <div>
                                                            <ListDivider />
                                                            <br />
                                                        </div>
                                                    }
                                                </div>;
                                            })}
                                        </List>
                                    </AccordionDetails>
                                </Accordion>}

                                <Accordion variant="outlined">
                                    <AccordionSummary expandIcon={<AddIcon />}
                                    >
                                        <Typography level="h6" sx={{ mb: 2, mt: 2, fontWeight: 'lg', fontSize: '0.7rem' }}>
                                            {Strings.checks}
                                        </Typography>
                                    </AccordionSummary>
                                    <Divider />
                                    <AccordionDetails style={{ backgroundColor: '#eeeeee' }} sx={{padding: 0}}>
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
                                        <Typography level="h6" sx={{ mb: 2, mt: 2, fontWeight: 'lg', fontSize: '0.7rem' }}>
                                            {Strings.reflections}
                                        </Typography>
                                    </AccordionSummary>
                                    <Divider />
                                    <AccordionDetails style={{ backgroundColor: '#eeeeee' }} sx={{padding: 0}}>
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
