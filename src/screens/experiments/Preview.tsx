import React from 'react';

import { useParams } from 'react-router-dom';
import { Typography, Box, Stack, Divider, Card, Link, List, ListItem, ListItemButton } from '@mui/joy';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AddIcon from '@mui/icons-material/Add';

import Page from '../../components/foundation/Page';

import { IExperiment, ITask } from '../../models/Experiment';
import BoxesSubMenu from './BoxesSubMenu';
import YouTubeVideo from '../../components/TaskModal/YoutubeVideo';
import ReactMarkdown from 'react-markdown';
import PageTitle from '../../components/foundation/PageTitle';
import Modal, { IModalProps } from '../../components/foundation/Modal';
import TaskBlock from '../../components/TaskModal/TaskBlock';
import { useFormFromBlocks } from '../../components/foundation/useForm';

const ExperimentTimeline = function () {
    const { experimentId } = useParams<{ experimentId: string }>();

    const [experiment, setExperiment] = React.useState<any>(null);

    React.useEffect(() => {
        // Listen for messages from the parent page
        window.addEventListener('message', (event) => {
            try {
                // Parse the JSON data
                const data = JSON.parse(event.data);
                if (data.xbExperiment) {
                    setExperiment(data.xbExperiment);
                }
            } catch (error) {}
        });
    }, []);

    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();

    const [taskModalOpen, setTaskModalOpen] = React.useState(false);
    const [dayNum, setDayNum] = React.useState(0);
    const [taskNum, setTaskNum] = React.useState(0);

    const getExperimentDescription = (experiment: IExperiment) => {
        return (
            <Stack spacing={0.5}>
                {experiment.desc.map((element) => (
                    <div>{getContent(element)}</div>
                ))}
            </Stack>
        );
    };

    const getContent = (block: any) => {
        if (block.type === 'para') {
            return (
                <Typography level="body1" sx={{ fontSize: '0.8rem' }}>
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
            return (
                <img
                    src={block.src}
                    alt={block.alt}
                    style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                />
            );
        }

        if (block.type === 'markdown') {
            return (
                <ReactMarkdown
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
            );
        }
        if (block.type === 'expandable') {
            return (
                <Accordion>
                    <AccordionSummary expandIcon={<AddIcon />}>
                        <Stack spacing={2}>
                            <Typography sx={{ mb: 2, mt: 2, fontWeight: 'lg', fontSize: '0.8rem' }}>
                                {block.title}
                            </Typography>
                            {block['summary'] && (
                                <Typography level="body1" sx={{ fontSize: '0.8rem' }}>
                                    {block['summary']}
                                </Typography>
                            )}
                        </Stack>
                    </AccordionSummary>

                    <Divider />

                    <AccordionDetails>
                        <Stack spacing={2}>{block.contents.map((element: any) => getContent(element))}</Stack>
                    </AccordionDetails>
                </Accordion>
            );
        }
    };

    return (
        <Page
            sx={{ height: '100%' }}
            footerComponent={BoxesSubMenu()}
            headerTitle={experiment?.name || '(No experiment name)'}
            disableBackButton
            ref={setPresentingElement}
        >
            {experiment && (
                <>
                    <Box sx={{ flex: 1, overflow: 'auto' }}>
                        <Card>
                            <Typography level="h6" sx={{ mb: 1, mt: 1, fontWeight: 'lg', fontSize: '1rem' }}>
                                {'OVERVIEW'}
                            </Typography>
                            {getExperimentDescription(experiment)}
                        </Card>
                    </Box>

                    {experiment.days
                        .filter((day: any) => !day.disabled)
                        .map((day: any, dayIndex: number) => (
                            <Accordion key={day.dayId}>
                                <AccordionSummary expandIcon={<AddIcon />}>
                                    <Stack spacing={2}>
                                        <Typography sx={{ mb: 2, mt: 2, fontWeight: 'lg', fontSize: '0.8rem' }}>
                                            Day {dayIndex + 1}
                                        </Typography>
                                    </Stack>
                                </AccordionSummary>

                                <Divider />

                                <AccordionDetails>
                                    <Stack spacing={2}>
                                        <ReactMarkdown
                                            children={day.description}
                                            components={{
                                                h1: ({ children }) => <PageTitle>{children}</PageTitle>,

                                                h2: ({ children }) => (
                                                    <Typography
                                                        level="h4"
                                                        component="h2"
                                                        color="primary"
                                                        sx={{ mt: 4 }}
                                                    >
                                                        {children}
                                                    </Typography>
                                                ),
                                                li: ({ children }) => (
                                                    <li style={{ marginTop: 2, fontSize: '0.8rem' }}>{children}</li>
                                                ),
                                                p: ({ children }) => (
                                                    <Typography sx={{ mt: 2, fontSize: '0.8rem' }}>
                                                        {children}
                                                    </Typography>
                                                ),

                                                a: ({ children, href }) => <Link href={href}>{children}</Link>,
                                            }}
                                        />

                                        {day.tasks.length > 0 && (
                                            <List>
                                                {day.tasks.map((task: any, taskIndex: number) => (
                                                    <ListItem key={task.taskId}>
                                                        <ListItemButton
                                                            onClick={() => {
                                                                setTaskModalOpen(true);
                                                                setTaskNum(taskIndex);
                                                                setDayNum(dayIndex);
                                                            }}
                                                        >
                                                            {task.name || '(no task name)'}
                                                        </ListItemButton>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        )}
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        ))}

                    {experiment.days[dayNum]?.tasks[taskNum] && (
                        <TaskModal
                            isOpen={taskModalOpen}
                            task={experiment.days[dayNum]?.tasks[taskNum]}
                            onDismiss={() => setTaskModalOpen(false)}
                            key={`${experimentId}.${dayNum}.${taskNum}`}
                            experimentId={experimentId}
                            dayNum={dayNum}
                            taskNum={taskNum}
                            presentingElement={presentingElement}
                            isSubscribed={true}
                        />
                    )}
                </>
            )}
        </Page>
    );
};

interface ITaskModalProps extends Omit<IModalProps, 'headerTitle'> {
    experimentId: string;
    dayNum: number;
    taskNum: number;
    isSubscribed: boolean;
    task: ITask;
}

const TaskModal = function ({ task, onDismiss, dayNum, taskNum, isSubscribed, ...others }: ITaskModalProps) {
    const { getCheckboxProps, getInputProps } = useFormFromBlocks(task.blocks);

    return (
        <Modal actionButtonLabel="Submit" headerTitle={task.name} onDismiss={onDismiss} {...others}>
            <Stack spacing={2}>
                {task.blocks.map((block, blockId) => (
                    <TaskBlock
                        type={task.type}
                        key={blockId}
                        block={block}
                        inputs={{ getCheckboxProps, getInputProps }}
                    />
                ))}
            </Stack>
        </Modal>
    );
};

export default ExperimentTimeline;
