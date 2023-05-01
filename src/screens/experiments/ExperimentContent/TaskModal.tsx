import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, TextField, Stack } from '@mui/joy';
import * as Yup from 'yup';

import YouTubeVideo from './YoutubeVideo';
import GreenDetector from './GreenDetector';
import HeartRateInput from './HeartRateInput';
import CountdownTimer from './CountdownTimer';
import TimeInput from './TimeInput';

import Modal, { IModalProps } from '../../../components/foundation/Modal';
import Select from '../../../components/foundation/Select';
import Checkbox from '../../../components/foundation/Checkbox';
import Slider from '../../../components/foundation/Slider';
import useForm from '../../../components/foundation/useForm';

import Experiment, { IGenericInput, ITask } from '../../../models/Experiment';
import { useDispatch, useSelector } from '../../../slices/store';
import { updateProgress } from '../../../slices/account';
import { selectTask } from '../../../slices/experiments';

interface ITaskModalProps extends Omit<IModalProps, 'headerTitle'> {
    taskLocation: [number, number];
}

const getInitialValues = function (blocks: ITask['blocks']) {
    const values: Record<string, string | boolean | number> = {};

    for (const block of blocks) {
        if (!(block as any).rk) {
            continue;
        }

        if (block.type === 'checkbox') {
            values[block.rk] = false;
            continue;
        }

        if (block.type === 'green-detector') {
            values[block.rk + '-$$g'] = '';
            values[block.rk + '-$$r'] = '';
            continue;
        }

        if (block.type === 'slider-input') {
            values[block.rk] = 0;
            continue;
        }

        values[(block as IGenericInput).rk] = '';
    }

    return values;
};

const numberSchema = Yup.number().typeError('This field must be a number');

const getSchema = function (blocks: ITask['blocks']) {
    const keys: Record<string, Yup.AnySchema> = {};

    for (const block of blocks) {
        if (!(block as any).rk) {
            continue;
        }

        if (block.type === 'green-detector') {
            if (!block.optional) {
                keys[block.rk + '-$$g'] = numberSchema.required('This field is missing');
                keys[block.rk + '-$$r'] = numberSchema.required('This field is missing');
                continue;
            }

            keys[block.rk + '-$$g'] = numberSchema;
            keys[block.rk + '-$$r'] = numberSchema;
            continue;
        }

        let subSchema: Yup.AnySchema = Yup.string();

        if (block.type === 'number-input' || block.type === 'heart-rate-input' || block.type === 'slider-input') {
            subSchema = numberSchema;
        }

        if (block.type === 'checkbox') {
            subSchema = Yup.bool();

            if (!block.optional) {
                subSchema = subSchema.oneOf([true], 'This field must be checked');
            }
        }

        if (!(block as IGenericInput).optional && block.type !== 'checkbox') {
            subSchema = subSchema.required('This field is missing');
        }

        keys[(block as IGenericInput).rk] = subSchema;
    }

    return Yup.object().shape(keys);
};

const TaskModal = function ({ onDismiss, taskLocation: [dayId, taskId], ...others }: ITaskModalProps) {
    const { experimentId } = useParams<{ experimentId: string }>();

    const task = useSelector((state) => selectTask(state, experimentId, dayId, taskId));

    const schema = React.useMemo(() => getSchema(task.blocks), [task.blocks]);
    const initialValues = React.useMemo(() => getInitialValues(task.blocks), [task.blocks]);

    const { createHandleSubmit, getCheckboxProps, getInputProps } = useForm(initialValues, schema);

    const dispatch = useDispatch();

    const handleSubmit = createHandleSubmit(async (data) => {
        if (Object.keys(data).length) {
            await Experiment.saveResponse({ experimentId, taskId, dayId, payload: data });
        }

        await dispatch(updateProgress({ experimentId, dayId, taskId }));

        onDismiss();
    });

    return (
        <Modal headerTitle={task.name} onAction={handleSubmit} onDismiss={onDismiss} {...others}>
            <Stack spacing={2}>
                {task.blocks.map((block, blockId) => {
                    if (block.type === 'para' || block.type === 'title') {
                        return (
                            <Typography level={block.type === 'para' ? 'body1' : 'h6'} key={blockId}>
                                {block.content}
                            </Typography>
                        );
                    }

                    if (block.type === 'video') {
                        return <YouTubeVideo src={block.src} />;
                    }

                    if (block.type === 'image') {
                        return <img src={block.src} alt={block.alt} />;
                    }

                    if (block.type === 'countdown') {
                        return <CountdownTimer key={blockId} initialDuration={block.duration} fixed={block.fixed} />;
                    }

                    if (block.type === 'green-detector') {
                        return (
                            <GreenDetector
                                key={blockId}
                                required={!block.optional}
                                greenInputProps={getInputProps(block.rk + '-$$g') as any}
                                redInputProps={getInputProps(block.rk + '-$$r') as any}
                            />
                        );
                    }

                    const hookProps = block.type === 'checkbox' ? getCheckboxProps(block.rk) : getInputProps(block.rk);

                    const commonProps = {
                        label: block.label,
                        required: !block.optional,
                        key: blockId,
                        ...(hookProps as any),
                        helperText: hookProps.helperText || block.help,
                    };

                    if (block.type === 'select-input') {
                        return <Select options={block.options} {...commonProps} />;
                    }

                    if (block.type === 'slider-input') {
                        return (
                            <Slider
                                min={block.range[0]}
                                max={block.range[1]}
                                size="sm"
                                valueLabelDisplay="auto"
                                marks
                                valueLabelFormat={(x) => block.labels[x]}
                                {...commonProps}
                            />
                        );
                    }

                    if (block.type === 'heart-rate-input') {
                        return <HeartRateInput {...commonProps} />;
                    }

                    if (block.type === 'time-input') {
                        return <TimeInput hideSeconds {...commonProps} />;
                    }

                    if (block.type === 'checkbox') {
                        return <Checkbox {...commonProps} />;
                    }

                    return <TextField {...commonProps} />;
                })}
            </Stack>
        </Modal>
    );
};

export default TaskModal;
