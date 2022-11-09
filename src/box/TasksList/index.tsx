import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, IconButton, Stack, Typography, Alert, Box } from '@mui/joy';
import {
    Play,
    CaretLeft,
    CaretRight,
    GraduationCap,
    NotePencil,
    Ruler,
    Camera,
    Flask,
    PencilLine,
    Check,
    Barbell,
} from 'phosphor-react';

import TaskModal from './TaskModal';
import { Page, PageTitle } from '../../common/ui/layout';
import { selectModuleById } from '../../common/slices/modules';
import { useSelector, useDispatch } from '../../common/store';
import { List, ListItem } from '../../common/ui/list';
import getErrorMessage from '../../common/utils/getErrorMessage';
import { getPlaylistResponses, selectPlaylistResponses } from '../../common/slices/responses';

const getTaskIcon = function (icon: string | undefined, draft: boolean | undefined) {
    // draft could be undefined, which should be handled differently
    if (draft === false) {
        return <Box component={Check} color="success.outlinedColor" />;
    }

    if (draft) {
        return <PencilLine />;
    }

    if (icon === 'ADVICE') {
        return <GraduationCap />;
    }

    if (icon === 'QUESTIONNAIRE') {
        return <NotePencil />;
    }

    if (icon === 'MEASURE') {
        return <Ruler />;
    }

    if (icon === 'CAMERA') {
        return <Camera />;
    }

    if (icon === 'EXPERIMENT') {
        return <Flask />;
    }

    if (icon === 'MOVE') {
        return <Barbell />;
    }
};

const TasksList = function () {
    const { moduleId } = useParams<{ moduleId: string }>();

    const module = useSelector((state) => selectModuleById(state, moduleId))!;

    const [playlistId, setPlaylistId] = React.useState(0);
    const createDirectionHandler = function (dir: 1 | -1) {
        return () => setPlaylistId(playlistId + dir);
    };

    const [taskOpen, setTaskOpen] = React.useState(false);

    const [taskId, setTaskId] = React.useState(0);
    const createTaskItemHandler = function (taskId: number) {
        return () => {
            setTaskId(taskId);
            setTaskOpen(true);
        };
    };

    const handleDismissTask = function () {
        setTaskOpen(false);
    };

    const playlist = module.playlists[playlistId];

    const [errorMessage, setErrorMessage] = React.useState<string>();
    const dispatch = useDispatch();
    React.useEffect(() => {
        const getResponses = async function () {
            try {
                dispatch(getPlaylistResponses({ moduleId, playlistId }));
            } catch (error) {
                setErrorMessage(getErrorMessage(error, 'Sorry, cannot retrieve your response at the moment'));
            }
        };

        getResponses();
    }, []);

    const responses = useSelector((state) => selectPlaylistResponses(state, moduleId, playlistId));

    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();

    return (
        <Page headerTitle={module.name} ref={setPresentingElement}>
            <PageTitle>{playlist.name}</PageTitle>
            <Stack spacing={2}>
                <Typography level="body2">
                    This playlist should take approximately {playlist.duration.magnitude} {playlist.duration.unit}(s)
                </Typography>

                <Stack direction="row" spacing={1}>
                    <IconButton color="neutral" disabled={playlistId === 0} onClick={createDirectionHandler(-1)}>
                        <CaretLeft />
                    </IconButton>
                    <Button startDecorator={<Play />} onClick={createTaskItemHandler(0)} fullWidth>
                        Start
                    </Button>
                    <IconButton
                        color="neutral"
                        disabled={playlistId === module.playlists.length - 1}
                        onClick={createDirectionHandler(1)}
                    >
                        <CaretRight />
                    </IconButton>
                </Stack>

                {errorMessage && <Alert color="danger">{errorMessage}</Alert>}

                <List>
                    {playlist.tasks.map((task) => (
                        <ListItem
                            key={task.id}
                            startDecorator={getTaskIcon(task.icon, responses && responses[task.id]?.draft)}
                            onClick={createTaskItemHandler(task.id)}
                            button
                        >
                            {task.name}
                        </ListItem>
                    ))}
                </List>

                <TaskModal
                    presentingElement={presentingElement}
                    isOpen={taskOpen}
                    playlistId={playlistId}
                    taskId={taskId}
                    onDismiss={handleDismissTask}
                />
            </Stack>
        </Page>
    );
};

export default TasksList;
