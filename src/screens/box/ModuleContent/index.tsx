import React from 'react';
import { useParams } from 'react-router-dom';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineDot,
    TimelineConnector,
    TimelineContent,
    timelineItemClasses,
} from '@mui/lab';
import { Box, Stack, Typography } from '@mui/joy';
import { CaretRight } from 'phosphor-react';

import TaskModal from './TaskModal';

import Page from '../../../components/foundation/Page';
import List from '../../../components/foundation/List';
import ListItem from '../../../components/foundation/ListItem';

import { selectModuleById } from '../../../slices/modules';
import { useSelector } from '../../../slices/store';
import getIcon from '../../../utils/getIcon';
import SectionTitle from '../../../components/foundation/SectionTitle';

const ModuleContent = function () {
    const { moduleId } = useParams<{ moduleId: string }>();
    const module = useSelector((state) => selectModuleById(state, moduleId))!;

    const [taskId, setTaskId] = React.useState(0);
    const [taskModalOpen, setTaskModalOpen] = React.useState(false);

    const createHandleClickTask = function (id: number) {
        return () => {
            setTaskId(id);
            setTaskModalOpen(true);
        };
    };

    const handleCloseTask = function () {
        setTaskModalOpen(false);
    };

    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();

    return (
        <Page headerTitle={module.name} ref={setPresentingElement}>
            <Timeline
                sx={{
                    padding: 0,
                    [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                    },
                }}
            >
                {module.playlists.map((playlist, playlistId) => (
                    <TimelineItem key={playlistId}>
                        <TimelineSeparator>
                            <TimelineDot sx={{ bgcolor: 'primary.plainColor' }} />
                            <TimelineConnector color="success" />
                        </TimelineSeparator>
                        <TimelineContent>
                            <SectionTitle sx={{ mb: 2 }}>{playlist.name}</SectionTitle>
                            {playlist.duration && (
                                <Typography level="body2" sx={{ mb: 2 }}>
                                    This playlist should take {playlist.duration.magnitude} {playlist.duration.unit}
                                </Typography>
                            )}
                            <List>
                                {playlist.tasks.map((task, taskId) => {
                                    const Icon = task.icon ? getIcon(task.icon) : undefined;

                                    return (
                                        <ListItem
                                            button
                                            key={taskId}
                                            startDecorator={Icon && <Icon />}
                                            endDecorator={<CaretRight />}
                                            onClick={createHandleClickTask(taskId)}
                                        >
                                            {task.name}
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>

            <TaskModal
                presentingElement={presentingElement}
                playlistId={0}
                taskId={taskId}
                onDismiss={handleCloseTask}
                isOpen={taskModalOpen}
            />
        </Page>
    );
};

export default ModuleContent;
