import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Stack, TextField } from '@mui/joy';
import * as Yup from 'yup';

import HeartrateInput from './HeartrateInput';

import Checkbox from '../../../components/foundation/Checkbox';
import Select from '../../../components/foundation/Select';
import useForm from '../../../components/foundation/useForm';
import Modal, { IModalProps } from '../../../components/foundation/Modal';

import { selectTask } from '../../../slices/modules';
import { useSelector, useDispatch } from '../../../slices/store';
import { IResponse, ITask } from '../../../models/Box';
import { selectTaskResponse, submitTaskResponse } from '../../../slices/responses';

interface ITaskProps extends Omit<IModalProps, 'headerTitle'> {
    playlistId: number;
    taskId: number;
}

type Inputs = NonNullable<ITask['inputs']>;

const generateInitialValues = function (inputs: Inputs, response: IResponse | undefined) {
    if (!inputs) {
        return {};
    }

    const values: Record<string, string | boolean> = {};
    for (const input of inputs) {
        if (response) {
            const value = response.payload[input.label];
            if (value) {
                values[input.label] = typeof value === 'number' ? value.toString() : value;
                continue;
            }
        }

        let initialValue: string | boolean = '';

        if (input.type === 'checkbox') {
            initialValue = false;
        }

        values[input.label] = initialValue;
    }

    return values;
};

const generateSchema = function (inputs: Inputs) {
    if (!inputs) {
        return Yup.object();
    }

    console.log('Schema created');

    const keys: Record<string, Yup.AnySchema> = {};

    for (const input of inputs) {
        let subSchema: Yup.AnySchema = Yup.string();

        if (input.type === 'number' || input.type === 'heartrate') {
            subSchema = Yup.number().typeError('This field must be a number');
        }

        if (input.type === 'checkbox') {
            subSchema = Yup.bool();

            if (!input.optional) {
                subSchema = subSchema.oneOf([true], 'This field must be checked');
            }
        }

        if (!input.optional && input.type !== 'checkbox') {
            subSchema = subSchema.required('This field is missing');
        }

        keys[input.label] = subSchema;
    }

    return Yup.object().shape(keys);
};

const TaskModal = function ({ playlistId, taskId, onDismiss, ...others }: ITaskProps) {
    console.log('TaskModal rendered');
    const { moduleId } = useParams<{ moduleId: string }>();

    const task = useSelector((state) => selectTask(state, moduleId, playlistId, taskId))!;
    const response = useSelector((state) => selectTaskResponse(state, moduleId, playlistId, taskId));

    const schema = React.useMemo(() => generateSchema(task?.inputs), [task?.inputs]);

    const { createHandleSubmit, getInputProps, getCheckboxProps, form } = useForm(
        generateInitialValues(task?.inputs, response),
        schema,
    );

    const dispatch = useDispatch();

    const handleAction = createHandleSubmit(async (payload) => {
        await dispatch(submitTaskResponse({ moduleId, playlistId, taskId, draft: false, payload }));
    });

    const handleDismiss = async function (reason?: string) {
        if (reason !== 'action') {
            form.resetErrors();
            form.resetDirty();
            await dispatch(
                submitTaskResponse({
                    moduleId,
                    playlistId,
                    taskId,
                    draft: !response || response.draft || form.dirty,
                    payload: form.values,
                }),
            );
        }

        onDismiss(reason);
    };

    return (
        <Modal headerTitle={task?.name} onDismiss={onDismiss} onAction={() => true} {...others}>
            <Stack spacing={2}>
                {task?.desc && <Typography level="body2">{task.desc}</Typography>}

                {task?.video && (
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

                {task?.inputs?.map((input) => {
                    const commonProps = {
                        label: input.label,
                        required: !input.optional,
                        key: input.label,
                        helperText: input.help,
                    };

                    if (input.type === 'select') {
                        return (
                            <Select options={input.options} {...commonProps} {...(getInputProps(input.label) as any)} />
                        );
                    }

                    if (input.type === 'checkbox') {
                        return <Checkbox {...commonProps} {...(getCheckboxProps(input.label) as any)} />;
                    }

                    if (input.type === 'heartrate') {
                        return <HeartrateInput {...commonProps} {...(getInputProps(input.label) as any)} />;
                    }

                    return <TextField type={input.type} {...commonProps} {...(getInputProps(input.label) as any)} />;
                })}
            </Stack>
        </Modal>
    );
};

export default TaskModal;
