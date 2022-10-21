import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, IconButton, Stack, Typography } from '@mui/joy';
import { Play, CaretLeft, CaretRight, GraduationCap, NotePencil, Ruler, Camera, Flask } from 'phosphor-react';

import { Page, PageTitle } from '../common/ui/layout';
import { selectModuleById } from '../common/slices/modules';
import { useSelector } from '../common/store';
import { List, ListItem } from '../common/ui/list';

const getTaskIcon = function (icon?: string) {
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
};

const TasksList = function () {
    const { type, moduleId } = useParams<{ type: string; moduleId: string }>();

    const module = useSelector((state) => selectModuleById(state, moduleId))!;

    const [playlistId, setPlaylistId] = React.useState(0);

    const createDirectionHandler = function (dir: 1 | -1) {
        return () => setPlaylistId(playlistId + dir);
    };

    const playlist = module.playlists[playlistId];

    return (
        <Page headerTitle={module.name}>
            <PageTitle>{playlist.name}</PageTitle>
            <Stack spacing={2}>
                <Typography level="body2">
                    This playlist should take approximately {playlist.duration.magnitude} {playlist.duration.unit}(s)
                </Typography>

                <Stack direction="row" spacing={1}>
                    <IconButton color="neutral" disabled={playlistId === 0} onClick={createDirectionHandler(-1)}>
                        <CaretLeft />
                    </IconButton>
                    <Button
                        component={Link}
                        to={`/main/box/${type}/${moduleId}/${playlistId}/0`}
                        startDecorator={<Play />}
                        fullWidth
                    >
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

                <List>
                    {playlist.tasks.map((task) => (
                        <ListItem
                            key={task.id}
                            href={`/main/box/${type}/${moduleId}/${playlistId}/${task.id}`}
                            startDecorator={getTaskIcon(task.icon)}
                        >
                            {task.name}
                        </ListItem>
                    ))}
                </List>
            </Stack>
        </Page>
    );
};

export default TasksList;
