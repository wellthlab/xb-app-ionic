import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Typography, Stack } from '@mui/joy';

import TaskForm from './TaskForm';
import { Page } from '../../common/ui/layout';
import { selectTask } from '../../common/slices/modules';
import { useSelector, useDispatch } from '../../common/store';
import { IResponse } from '../../common/models/Box';
import { selectPlaylistResponses, submitTaskResponse } from '../../common/slices/responses';

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
    const responses = useSelector((state) => selectPlaylistResponses(state, moduleId, playlistId));

    const dispatch = useDispatch();
    const history = useHistory();
    const handleSubmit = async function (payload: IResponse['payload'], draft: boolean) {
        await dispatch(submitTaskResponse({ moduleId, playlistId, taskId, draft, payload }));
        history.goBack();
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

                {task.inputs && (
                    <TaskForm response={responses && responses[taskId]} inputs={task.inputs} onSubmit={handleSubmit} />
                )}
            </Stack>
        </Page>
    );
};

export default Task;
