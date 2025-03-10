import Strings from '../../../utils/string_dict.js';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
    Typography,
    Box,
    Stack,
    Alert,
    Divider,
    Link,
} from '@mui/joy';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AddIcon from '@mui/icons-material/Add';
import TaskModal from './TaskModal';
import TasksList from "./TasksList";

import {ExperimentCategory, IExperiment} from '../../../models/Experiment';
import YouTubeVideo from '../../../components/TaskModal/YoutubeVideo';
import ReactMarkdown from 'react-markdown';
import PageTitle from '../../../components/foundation/PageTitle';

const asset_dir = '/assets/experiments/';

interface IExperimentTimelineProps {
    experiment: IExperiment;
}

const ExperimentTimeline = function ({
                                         experiment
                                     }: IExperimentTimelineProps) {
    const dayProgress: any[] = [];
    const isSubscribedToExperiment = false;
    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();

    const [taskModalOpen, setTaskModalOpen] = React.useState(false);
    const [dayNum, setDayNum] = React.useState(0);
    const [taskNum, setTaskNum] = React.useState(0);

    const [reflectionModalOpen, setReflectionModalOpen] = React.useState(false);
    const [reflectionDayNum, setReflectionDayNum] = React.useState<number>(0);
    const [reflectionTaskNum, setReflectionTaskNum] = React.useState(0);

    const theme = useTheme();

    const handleDismissModal = function(type: string) {
        if (type === 'normal') {
            setTaskModalOpen(false);
        } else if (type === 'reflection') {
            setReflectionModalOpen(false);
        }
    };

    const handleClickTask = function(experimentId: string, dayNum: number, taskNum: number, type: string) {
        if (type === 'normal') {
            setTaskModalOpen(true);
            setDayNum(dayNum);
            setTaskNum(taskNum);
        } else if (type === 'reflection') {
            setReflectionModalOpen(true);
            setReflectionDayNum(dayNum);
            setReflectionTaskNum(taskNum);
        }
    };

    const currentDay = 0;
    const [activeDay, setActiveDay] = React.useState(0);

    const handleNext = () => {
        setActiveDay((prevActiveDay) => prevActiveDay + 1);
    };

    const handleBack = () => {
        setActiveDay((prevActiveDay) => prevActiveDay - 1);
    };

    const getExperimentDescription = (experiment: IExperiment) => {
        return <Stack spacing={0.5}>
            {experiment.desc.map((element) => (
                <div>
                    {getContent(element)}
                </div>
            ))}
        </Stack>;
    };

    const getContent = (block: any) => {

        if (block.type === 'para') {
            return (
                <Typography level="body1" sx = {{fontSize: '0.8rem'}}>
                    {block['content']}
                </Typography>
            );
        }

        if (block.type === 'title') {
            return (
                <Typography level="h5" sx={{ mb: 2, mt: 2, fontWeight: 'lg', fontSize: '0.8rem' }}>
                    {block['content']}
                </Typography>
            );
        }

        if (block.type === 'video') {
            return <YouTubeVideo src={block.src} />;
        }

        if (block.type === 'image') {
            return <img src={asset_dir + block.src + '.jpg'} alt={block.alt}
                        style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />;
        }

        if (block.type === 'markdown') {
            return  <ReactMarkdown
                children={block['content']}
                components={{
                    h1: ({ children }) => <PageTitle>{children}</PageTitle>,

                    h2: ({ children }) => (
                        <Typography level="h4" component="h2" color="primary" sx={{ mt: 4 }}>
                            {children}
                        </Typography>
                    ),
                    li: ({ children }) => <li style={{ marginTop: 2, fontSize: '0.8rem' }}>{children}</li>,
                    p: ({ children }) => <Typography sx={{ mt: 2, fontSize: '0.8rem' }}>{children}</Typography>,

                    a: ({ children, href }) => <Link href={href}>{children}</Link>,
                }}
            />
        }
        if (block.type === 'expandable') {
            return <Accordion>
                <AccordionSummary expandIcon={<AddIcon />}>
                    <Stack spacing={2}>
                        <Typography
                            sx={{ mb: 2, mt: 2, fontWeight: 'lg', fontSize: '0.8rem' }}>
                            {block.title}
                        </Typography>
                        {block['summary'] &&
                            <Typography level="body1" sx = {{fontSize: '0.8rem'}}>
                                {block['summary']}
                            </Typography>}
                    </Stack>

                </AccordionSummary>


                <Divider />

                <AccordionDetails style={{ backgroundColor: '#eeeeee' }} >
                    <br />
                    <Stack spacing={2}>
                        {block.contents.map((element: any) => (
                            getContent(element)
                        ))}
                    </Stack>
                </AccordionDetails>
            </Accordion>;
        }
    };

    const experimentCompleted = dayProgress.reduce((acc, curr) => acc && curr, true);
    const reflectionTasks = experiment.days[0].tasks.filter(task => task.type === 'reflection');

    return (
        <div>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <Stack spacing={2} key={activeDay}>
                    <TasksList
                        tasks={experiment.days[currentDay].tasks}
                        experimentId={experiment.id}
                        dayNum={activeDay}
                        type={'normal'}
                        onTaskClick={handleClickTask}
                    />
                    <TasksList
                        tasks={experiment.days[currentDay].tasks}
                        experimentId={experiment.id}
                        dayNum={activeDay}
                        type={'reflection'}
                        onTaskClick={handleClickTask}
                    />
                </Stack>

            </Box>


            {experimentCompleted && (
                <Stack spacing={2}>
                    <Alert color="success">{Strings.congratulations_you_have}</Alert>
                </Stack>
            )}

            <TaskModal
                isOpen={taskModalOpen}
                onDismiss={() => handleDismissModal('normal')}
                key={`${experiment.id}.${dayNum}.${taskNum}.normal`}
                experiment={experiment}
                dayNum={dayNum}
                taskNum={taskNum}
                presentingElement={presentingElement}
                isSubscribed={isSubscribedToExperiment}
            />

            {reflectionTasks.length !== 0 && <TaskModal
                isOpen={reflectionModalOpen}
                onDismiss={() => handleDismissModal('reflection')}
                key={`${experiment.id}.${reflectionDayNum}.${reflectionTaskNum}.reflect`}
                experiment={experiment}
                dayNum={reflectionDayNum}
                taskNum={reflectionTaskNum}
                presentingElement={presentingElement}
                isSubscribed={isSubscribedToExperiment}
            />}

        </div>
    );
};

export default ExperimentTimeline;
