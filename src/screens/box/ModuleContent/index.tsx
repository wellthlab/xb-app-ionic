import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack } from '@mui/joy';
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

    const [taskId, setTaskId] = React.useState(-1);

    const createHandleClickTask = function (id: number) {
        return () => setTaskId(id);
    };

    const handleCloseTask = function () {
        console.log('Task closed');
        setTaskId(-1);
    };

    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();

    return (
        <Page headerTitle={module.name} ref={setPresentingElement}>
            <Stack spacing={2}>
                {module.playlists.map((playlist) => (
                    <Stack direction="row" spacing={1}>
                        <div>
                            <Box
                                sx={{
                                    borderRadius: '50%',
                                    width: 24,
                                    height: 24,
                                    bgcolor: 'primary.solidBg',
                                }}
                            />
                        </div>
                        <Box sx={{ flex: 1 }}>
                            <SectionTitle sx={{ mb: 2 }}>{playlist.name}</SectionTitle>
                            <List>
                                {playlist.tasks.map((task) => {
                                    const Icon = task.icon ? getIcon(task.icon) : undefined;

                                    return (
                                        <ListItem
                                            button
                                            key={task.id}
                                            startDecorator={Icon && <Icon />}
                                            endDecorator={<CaretRight />}
                                            onClick={createHandleClickTask(task.id)}
                                        >
                                            {task.name}
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Box>
                    </Stack>
                ))}
            </Stack>

            <TaskModal
                presentingElement={presentingElement}
                playlistId={0}
                taskId={taskId}
                onDismiss={handleCloseTask}
                isOpen={taskId !== -1}
            />
        </Page>
    );
};

export default ModuleContent;
