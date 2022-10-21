import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Stack, TextField, Slider } from '@mui/joy';

import { Page } from '../common/ui/layout';
import { selectTask } from '../common/slices/modules';
import { useSelector } from '../common/store';
import { Form, Select } from '../common/ui/form';

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

                <Form onSubmit={() => {}}>
                    {task.inputs &&
                        task.inputs.map((input) => {
                            const commonProps = { label: input.label, required: !input.optional };
                            if (input.type === 'text' || input.type === 'number') {
                                return <TextField type={input.type} {...commonProps} />;
                            }

                            if (input.type === 'select') {
                                return <Select options={input.options} {...commonProps} value="" onChange={() => {}} />;
                            }

                            if (input.type === 'slider') {
                                return (
                                    <Slider
                                        step={input.step}
                                        min={input.range[0]}
                                        max={input.range[1]}
                                        {...commonProps}
                                    />
                                );
                            }

                            return <div>HeartRate</div>;
                        })}
                </Form>
            </Stack>
        </Page>
    );
};

export default Task;
