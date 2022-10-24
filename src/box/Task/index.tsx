import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Stack, Alert } from '@mui/joy';

import TaskForm from './TaskForm';
import { Page } from '../../common/ui/layout';
import { selectTask } from '../../common/slices/modules';
import { useSelector } from '../../common/store';
import Box, { IResponse } from '../../common/models/Box';

const Task = function () {
    const { moduleId, playlistId: rawPlaylistId, taskId: rawTaskId } = useParams<{
        type: string;
        moduleId: string;
        playlistId: string;
        taskId: string;
    }>();

    const playlistId = parseInt(rawPlaylistId, 10);
    const taskId = parseInt(rawTaskId, 10);

    const task = useSelector((state) => selectTask(state, moduleId, playlistId, taskId))!;

    const handleSubmit = function (data: IResponse['payload'], draft?: boolean) {
        return Box.submitTaskResponse(moduleId, playlistId, taskId, data, draft || false);
    };

    return (
        <Page headerTitle={task.name}>
            <Stack spacing={2}>
                {task.desc && <Typography level="body2">{task.desc}</Typography>}

                {task.video && (
                    <iframe
                        title="playlist-videoplayer"
                        frameBorder={0}
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        style={{ width: '100%', height: '300px' }}
                        src={`https://www.youtube-nocookie.com/embed/${task.video}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0`}
                    />
                )}

                {errorMessage && <Alert color="danger">{errorMessage}</Alert>}

                {task.inputs && <TaskForm response={response} inputs={task.inputs} onSubmit={handleSubmit} />}
            </Stack>
        </Page>
    );
};

export default Task;
